const express = require('express');
const mongoose = require('mongoose');
const Project = require('../models/Project');
const Client = require('../models/Client');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { projectSchema } = require('../validation/schemas');

const router = express.Router();

// @route   GET /api/projects
// @desc    Get all projects
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const status = req.query.status;
    const priority = req.query.priority;
    const client = req.query.client;
    const isActive = req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined;

    // Build filter
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (client) filter.client = client;
    if (isActive !== undefined) filter.isActive = isActive;

    // For non-admin users, only show projects they created or are team members of
    if (req.user.role !== 'admin') {
      filter.$or = [
        { createdBy: req.user._id },
        { teamMembers: req.user._id }
      ];
    }

    const projects = await Project.find(filter)
      .populate('client', 'name email company')
      .populate('createdBy', 'username email')
      .populate('teamMembers', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Project.countDocuments(filter);

    res.json({
      projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error while fetching projects' });
  }
});

// @route   GET /api/projects/:id
// @desc    Get project by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    
    // For non-admin users, only show projects they created or are team members of
    if (req.user.role !== 'admin') {
      filter.$or = [
        { createdBy: req.user._id },
        { teamMembers: req.user._id }
      ];
    }

    const project = await Project.findOne(filter)
      .populate('client', 'name email company phone address')
      .populate('createdBy', 'username email')
      .populate('teamMembers', 'username email role');

    if (!project) {
      return res.status(404).json({ message: 'Project not found or access denied' });
    }

    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error while fetching project' });
  }
});

// @route   POST /api/projects
// @desc    Create a new project
// @access  Private
router.post('/', auth, validate(projectSchema), async (req, res) => {
  try {
    const { client: clientId, teamMembers, ...projectData } = req.body;

    // Verify client exists and user has access
    const clientFilter = { _id: clientId, isActive: true };
    if (req.user.role !== 'admin') {
      clientFilter.createdBy = req.user._id;
    }

    const client = await Client.findOne(clientFilter);
    if (!client) {
      return res.status(404).json({ message: 'Client not found or access denied' });
    }

    // Verify team members exist if provided
    if (teamMembers && teamMembers.length > 0) {
      const validMembers = await User.find({ 
        _id: { $in: teamMembers }, 
        isActive: true 
      });
      
      if (validMembers.length !== teamMembers.length) {
        return res.status(400).json({ message: 'One or more team members not found' });
      }
    }

    const project = new Project({
      ...projectData,
      client: clientId,
      teamMembers: teamMembers || [],
      createdBy: req.user._id
    });

    await project.save();
    
    await project.populate([
      { path: 'client', select: 'name email company' },
      { path: 'createdBy', select: 'username email' },
      { path: 'teamMembers', select: 'username email' }
    ]);

    res.status(201).json({
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error while creating project' });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private
router.put('/:id', auth, validate(projectSchema), async (req, res) => {
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const { client: clientId, teamMembers, ...updateData } = req.body;

    // Check if project exists and user has access
    const projectFilter = { _id: req.params.id };
    if (req.user.role !== 'admin') {
      projectFilter.createdBy = req.user._id;
    }

    const existingProject = await Project.findOne(projectFilter);
    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found or access denied' });
    }

    // Verify client exists and user has access if client is being updated
    if (clientId) {
      const clientFilter = { _id: clientId, isActive: true };
      if (req.user.role !== 'admin') {
        clientFilter.createdBy = req.user._id;
      }

      const client = await Client.findOne(clientFilter);
      if (!client) {
        return res.status(404).json({ message: 'Client not found or access denied' });
      }
      updateData.client = clientId;
    }

    // Verify team members exist if provided
    if (teamMembers && teamMembers.length > 0) {
      const validMembers = await User.find({ 
        _id: { $in: teamMembers }, 
        isActive: true 
      });
      
      if (validMembers.length !== teamMembers.length) {
        return res.status(400).json({ message: 'One or more team members not found' });
      }
      updateData.teamMembers = teamMembers;
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate([
      { path: 'client', select: 'name email company' },
      { path: 'createdBy', select: 'username email' },
      { path: 'teamMembers', select: 'username email' }
    ]);

    res.json({
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error while updating project' });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project (soft delete)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    
    // For non-admin users, only allow deleting projects they created
    if (req.user.role !== 'admin') {
      filter.createdBy = req.user._id;
    }

    const project = await Project.findOne(filter);

    if (!project) {
      return res.status(404).json({ message: 'Project not found or access denied' });
    }

    // Soft delete
    project.isActive = false;
    await project.save();

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error while deleting project' });
  }
});

// @route   PATCH /api/projects/:id/status
// @desc    Update project status
// @access  Private
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['planning', 'in-progress', 'completed', 'on-hold', 'cancelled'];
    
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Valid statuses are: ' + validStatuses.join(', ') 
      });
    }

    const filter = { _id: req.params.id };
    
    // For non-admin users, allow updating status if they created the project or are team members
    if (req.user.role !== 'admin') {
      filter.$or = [
        { createdBy: req.user._id },
        { teamMembers: req.user._id }
      ];
    }

    const project = await Project.findOneAndUpdate(
      filter,
      { status },
      { new: true, runValidators: true }
    ).populate([
      { path: 'client', select: 'name email' },
      { path: 'createdBy', select: 'username email' }
    ]);

    if (!project) {
      return res.status(404).json({ message: 'Project not found or access denied' });
    }

    res.json({
      message: 'Project status updated successfully',
      project
    });
  } catch (error) {
    console.error('Update project status error:', error);
    res.status(500).json({ message: 'Server error while updating project status' });
  }
});

// @route   POST /api/projects/:id/team-members
// @desc    Add team member to project
// @access  Private
router.post('/:id/team-members', auth, async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user || !user.isActive) {
      return res.status(404).json({ message: 'User not found' });
    }

    const filter = { _id: req.params.id };
    
    // For non-admin users, only allow adding team members to projects they created
    if (req.user.role !== 'admin') {
      filter.createdBy = req.user._id;
    }

    const project = await Project.findOne(filter);

    if (!project) {
      return res.status(404).json({ message: 'Project not found or access denied' });
    }

    // Check if user is already a team member
    if (project.teamMembers.includes(userId)) {
      return res.status(400).json({ message: 'User is already a team member' });
    }

    project.teamMembers.push(userId);
    await project.save();

    await project.populate('teamMembers', 'username email');

    res.json({
      message: 'Team member added successfully',
      teamMembers: project.teamMembers
    });
  } catch (error) {
    console.error('Add team member error:', error);
    res.status(500).json({ message: 'Server error while adding team member' });
  }
});

// @route   DELETE /api/projects/:id/team-members/:userId
// @desc    Remove team member from project
// @access  Private
router.delete('/:id/team-members/:userId', auth, async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    
    // For non-admin users, only allow removing team members from projects they created
    if (req.user.role !== 'admin') {
      filter.createdBy = req.user._id;
    }

    const project = await Project.findOne(filter);

    if (!project) {
      return res.status(404).json({ message: 'Project not found or access denied' });
    }

    // Remove team member
    project.teamMembers = project.teamMembers.filter(
      member => member.toString() !== req.params.userId
    );
    
    await project.save();
    await project.populate('teamMembers', 'username email');

    res.json({
      message: 'Team member removed successfully',
      teamMembers: project.teamMembers
    });
  } catch (error) {
    console.error('Remove team member error:', error);
    res.status(500).json({ message: 'Server error while removing team member' });
  }
});

module.exports = router;
