const request = require('supertest');
const app = require('../../../server');
const Project = require('../../models/Project');
const { 
  createTestUser, 
  createTestAdmin, 
  createTestClient, 
  generateToken, 
  getAuthHeaders 
} = require('../utils/helpers');

describe('PUT /api/projects/:id - Update Project', () => {
  let user, admin, anotherUser, client, project, userToken, adminToken, anotherUserToken;

  beforeEach(async () => {
    user = await createTestUser();
    admin = await createTestAdmin();
    anotherUser = await createTestUser({
      username: 'anotheruser',
      email: 'another@example.com'
    });

    userToken = generateToken(user._id);
    adminToken = generateToken(admin._id);
    anotherUserToken = generateToken(anotherUser._id);

    client = await createTestClient(user._id);

    // Create a test project
    project = new Project({
      name: 'Test Project',
      description: 'Test project description',
      client: client._id,
      status: 'planning',
      priority: 'medium',
      budget: 10000,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      createdBy: user._id
    });
    await project.save();
  });

  describe('Authentication Tests', () => {
    test('should reject request without token', async () => {
      const updateData = {
        name: 'Updated Project',
        client: client._id
      };

      const response = await request(app)
        .put(`/api/projects/${project._id}`)
        .send(updateData);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Access denied. No token provided.');
    });

    test('should reject request with invalid token', async () => {
      const updateData = {
        name: 'Updated Project',
        client: client._id
      };

      const response = await request(app)
        .put(`/api/projects/${project._id}`)
        .set('Authorization', 'Bearer invalid-token')
        .send(updateData);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid token.');
    });
  });

  describe('Authorization Tests', () => {
    test('should allow project creator to update project', async () => {
      const updateData = {
        name: 'Updated by Creator',
        client: client._id,
        description: 'Updated description'
      };

      const response = await request(app)
        .put(`/api/projects/${project._id}`)
        .set(getAuthHeaders(userToken))
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Project updated successfully');
      expect(response.body.project.name).toBe('Updated by Creator');
    });

    test('should allow admin to update any project', async () => {
      const updateData = {
        name: 'Updated by Admin',
        client: client._id,
        status: 'in-progress'
      };

      const response = await request(app)
        .put(`/api/projects/${project._id}`)
        .set(getAuthHeaders(adminToken))
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Project updated successfully');
      expect(response.body.project.name).toBe('Updated by Admin');
      expect(response.body.project.status).toBe('in-progress');
    });

    test('should deny access to non-creator regular user', async () => {
      const updateData = {
        name: 'Unauthorized Update',
        client: client._id
      };

      const response = await request(app)
        .put(`/api/projects/${project._id}`)
        .set(getAuthHeaders(anotherUserToken))
        .send(updateData);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Project not found or access denied');
    });
  });

  describe('Validation Tests', () => {
    test('should reject request with missing required fields', async () => {
      const response = await request(app)
        .put(`/api/projects/${project._id}`)
        .set(getAuthHeaders(userToken))
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Validation Error');
      expect(response.body.errors).toContain('Name is required');
      expect(response.body.errors).toContain('Client is required');
    });

    test('should reject request with invalid client ID format', async () => {
      const updateData = {
        name: 'Updated Project',
        client: 'invalid-client-id'
      };

      const response = await request(app)
        .put(`/api/projects/${project._id}`)
        .set(getAuthHeaders(userToken))
        .send(updateData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Validation Error');
      expect(response.body.errors).toContain('Invalid client ID format');
    });

    test('should reject request with invalid status', async () => {
      const updateData = {
        name: 'Updated Project',
        client: client._id,
        status: 'invalid-status'
      };

      const response = await request(app)
        .put(`/api/projects/${project._id}`)
        .set(getAuthHeaders(userToken))
        .send(updateData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Validation Error');
    });

    test('should reject request with invalid priority', async () => {
      const updateData = {
        name: 'Updated Project',
        client: client._id,
        priority: 'super-urgent'
      };

      const response = await request(app)
        .put(`/api/projects/${project._id}`)
        .set(getAuthHeaders(userToken))
        .send(updateData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Validation Error');
    });

    test('should reject request with negative budget', async () => {
      const updateData = {
        name: 'Updated Project',
        client: client._id,
        budget: -1000
      };

      const response = await request(app)
        .put(`/api/projects/${project._id}`)
        .set(getAuthHeaders(userToken))
        .send(updateData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Validation Error');
      expect(response.body.errors).toContain('Budget must be a positive number');
    });

    test('should reject request with end date before start date', async () => {
      const updateData = {
        name: 'Updated Project',
        client: client._id,
        startDate: '2024-12-31',
        endDate: '2024-01-01'
      };

      const response = await request(app)
        .put(`/api/projects/${project._id}`)
        .set(getAuthHeaders(userToken))
        .send(updateData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Validation Error');
      expect(response.body.errors).toContain('End date must be after start date');
    });

    test('should reject request with name exceeding maximum length', async () => {
      const updateData = {
        name: 'a'.repeat(101), // exceeds 100 character limit
        client: client._id
      };

      const response = await request(app)
        .put(`/api/projects/${project._id}`)
        .set(getAuthHeaders(userToken))
        .send(updateData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Validation Error');
      expect(response.body.errors).toContain('Name must not exceed 100 characters');
    });

    test('should reject request with description exceeding maximum length', async () => {
      const updateData = {
        name: 'Updated Project',
        client: client._id,
        description: 'a'.repeat(1001) // exceeds 1000 character limit
      };

      const response = await request(app)
        .put(`/api/projects/${project._id}`)
        .set(getAuthHeaders(userToken))
        .send(updateData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Validation Error');
      expect(response.body.errors).toContain('Description must not exceed 1000 characters');
    });
  });

  describe('Business Logic Tests', () => {
    test('should reject request with non-existent client', async () => {
      const nonExistentClientId = '507f1f77bcf86cd799439011';
      const updateData = {
        name: 'Updated Project',
        client: nonExistentClientId
      };

      const response = await request(app)
        .put(`/api/projects/${project._id}`)
        .set(getAuthHeaders(userToken))
        .send(updateData);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Client not found or access denied');
    });

    test('should reject request with client created by another user (for non-admin)', async () => {
      // Create a client by another user
      const anotherClient = await createTestClient(anotherUser._id, {
        name: 'Another Client',
        email: 'another@client.com'
      });

      const updateData = {
        name: 'Updated Project',
        client: anotherClient._id
      };

      const response = await request(app)
        .put(`/api/projects/${project._id}`)
        .set(getAuthHeaders(userToken))
        .send(updateData);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Client not found or access denied');
    });

    test('should allow admin to use any client', async () => {
      // Admin creates a client
      const adminClient = await createTestClient(admin._id, {
        name: 'Admin Client',
        email: 'admin@client.com'
      });

      const updateData = {
        name: 'Updated by Admin',
        client: adminClient._id
      };

      const response = await request(app)
        .put(`/api/projects/${project._id}`)
        .set(getAuthHeaders(adminToken))
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.project.client._id).toBe(adminClient._id.toString());
    });

    test('should reject request with non-existent team members', async () => {
      const nonExistentUserId = '507f1f77bcf86cd799439011';
      const updateData = {
        name: 'Updated Project',
        client: client._id,
        teamMembers: [nonExistentUserId]
      };

      const response = await request(app)
        .put(`/api/projects/${project._id}`)
        .set(getAuthHeaders(userToken))
        .send(updateData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('One or more team members not found');
    });

    test('should handle non-existent project ID', async () => {
      const nonExistentProjectId = '507f1f77bcf86cd799439011';
      const updateData = {
        name: 'Updated Project',
        client: client._id
      };

      const response = await request(app)
        .put(`/api/projects/${nonExistentProjectId}`)
        .set(getAuthHeaders(userToken))
        .send(updateData);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Project not found or access denied');
    });

    test('should handle invalid project ID format', async () => {
      const updateData = {
        name: 'Updated Project',
        client: client._id
      };

      const response = await request(app)
        .put('/api/projects/invalid-id')
        .set(getAuthHeaders(userToken))
        .send(updateData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid ID format');
    });
  });

  describe('Success Cases', () => {
    test('should update project with basic fields', async () => {
      const updateData = {
        name: 'Updated Project Name',
        client: client._id,
        description: 'Updated description',
        status: 'in-progress',
        priority: 'high'
      };

      const response = await request(app)
        .put(`/api/projects/${project._id}`)
        .set(getAuthHeaders(userToken))
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Project updated successfully');
      expect(response.body.project).toMatchObject({
        name: updateData.name,
        description: updateData.description,
        status: updateData.status,
        priority: updateData.priority
      });
    });

    test('should update project with all fields', async () => {
      const updateData = {
        name: 'Completely Updated Project',
        client: client._id,
        description: 'Completely updated description',
        status: 'completed',
        priority: 'urgent',
        budget: 25000,
        startDate: '2024-02-01',
        endDate: '2024-11-30',
        deliverables: [
          {
            name: 'Updated Deliverable 1',
            description: 'Updated description 1',
            completed: true
          },
          {
            name: 'Updated Deliverable 2',
            description: 'Updated description 2',
            completed: false
          }
        ],
        teamMembers: [admin._id],
        tags: ['updated', 'testing', 'api']
      };

      const response = await request(app)
        .put(`/api/projects/${project._id}`)
        .set(getAuthHeaders(userToken))
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.project).toMatchObject({
        name: updateData.name,
        description: updateData.description,
        status: updateData.status,
        priority: updateData.priority,
        budget: updateData.budget,
        deliverables: updateData.deliverables,
        tags: updateData.tags
      });
      expect(response.body.project.teamMembers).toHaveLength(1);
      expect(response.body.project.teamMembers[0]._id).toBe(admin._id.toString());
    });

    test('should trim whitespace from string fields', async () => {
      const updateData = {
        name: '  Updated Project Name  ',
        client: client._id,
        description: '  Updated description  '
      };

      const response = await request(app)
        .put(`/api/projects/${project._id}`)
        .set(getAuthHeaders(userToken))
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.project.name).toBe('Updated Project Name');
      expect(response.body.project.description).toBe('Updated description');
    });

    test('should populate related fields in response', async () => {
      const updateData = {
        name: 'Updated Project',
        client: client._id,
        teamMembers: [admin._id]
      };

      const response = await request(app)
        .put(`/api/projects/${project._id}`)
        .set(getAuthHeaders(userToken))
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.project.client).toMatchObject({
        _id: client._id.toString(),
        name: client.name,
        email: client.email
      });
      expect(response.body.project.createdBy).toMatchObject({
        _id: user._id.toString(),
        username: user.username,
        email: user.email
      });
      expect(response.body.project.teamMembers[0]).toMatchObject({
        _id: admin._id.toString(),
        username: admin.username,
        email: admin.email
      });
    });

    test('should preserve unchanged fields', async () => {
      const originalBudget = project.budget;
      const originalTags = project.tags;

      const updateData = {
        name: 'Only Name Updated',
        client: client._id
      };

      const response = await request(app)
        .put(`/api/projects/${project._id}`)
        .set(getAuthHeaders(userToken))
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.project.name).toBe('Only Name Updated');
      expect(response.body.project.budget).toBe(originalBudget);
      expect(response.body.project.description).toBe(project.description);
    });

    test('should strip unknown fields from request', async () => {
      const updateData = {
        name: 'Updated Project',
        client: client._id,
        unknownField: 'should be ignored',
        hackerField: 'malicious data'
      };

      const response = await request(app)
        .put(`/api/projects/${project._id}`)
        .set(getAuthHeaders(userToken))
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.project.unknownField).toBeUndefined();
      expect(response.body.project.hackerField).toBeUndefined();
    });
  });
});
