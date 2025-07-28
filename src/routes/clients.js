const express = require('express');
const Client = require('../models/Client');
const Project = require('../models/Project');
const { auth, adminAuth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { clientSchema } = require('../validation/schemas');

const router = express.Router();

// @route   GET /api/clients
// @desc    Get all clients
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const isActive = req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined;

    // Build filter
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }
    if (isActive !== undefined) {
      filter.isActive = isActive;
    }

    // For non-admin users, only show clients they created
    if (req.user.role !== 'admin') {
      filter.createdBy = req.user._id;
    }

    const clients = await Client.find(filter)
      .populate('createdBy', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Client.countDocuments(filter);

    res.json({
      clients,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({ message: 'Server error while fetching clients' });
  }
});

// @route   GET /api/clients/:id
// @desc    Get client by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    
    // For non-admin users, only show clients they created
    if (req.user.role !== 'admin') {
      filter.createdBy = req.user._id;
    }

    const client = await Client.findOne(filter)
      .populate('createdBy', 'username email');

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.json(client);
  } catch (error) {
    console.error('Get client error:', error);
    res.status(500).json({ message: 'Server error while fetching client' });
  }
});

// @route   POST /api/clients
// @desc    Create a new client
// @access  Private
router.post('/', auth, validate(clientSchema), async (req, res) => {
  try {
    const clientData = {
      ...req.body,
      createdBy: req.user._id
    };

    const client = new Client(clientData);
    await client.save();
    
    await client.populate('createdBy', 'username email');

    res.status(201).json({
      message: 'Client created successfully',
      client
    });
  } catch (error) {
    console.error('Create client error:', error);
    
    // Handle duplicate key error (MongoDB error code 11000)
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ 
        message: `${field} already exists`,
        error: 'Validation error'
      });
    }
    
    res.status(500).json({ message: 'Server error while creating client' });
  }
});

// @route   PUT /api/clients/:id
// @desc    Update client
// @access  Private
router.put('/:id', auth, validate(clientSchema), async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    
    // For non-admin users, only allow updating clients they created
    if (req.user.role !== 'admin') {
      filter.createdBy = req.user._id;
    }

    const client = await Client.findOneAndUpdate(
      filter,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'username email');

    if (!client) {
      return res.status(404).json({ message: 'Client not found or access denied' });
    }

    res.json({
      message: 'Client updated successfully',
      client
    });
  } catch (error) {
    console.error('Update client error:', error);
    res.status(500).json({ message: 'Server error while updating client' });
  }
});

// @route   DELETE /api/clients/:id
// @desc    Delete client (soft delete)
// @access  Private (Admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Check if client has active projects
    const activeProjects = await Project.countDocuments({ 
      client: req.params.id, 
      isActive: true 
    });

    if (activeProjects > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete client with active projects. Please complete or remove projects first.' 
      });
    }

    // Soft delete
    client.isActive = false;
    await client.save();

    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Delete client error:', error);
    res.status(500).json({ message: 'Server error while deleting client' });
  }
});

// @route   GET /api/clients/:id/projects
// @desc    Get projects for a specific client
// @access  Private
router.get('/:id/projects', auth, async (req, res) => {
  try {
    const clientFilter = { _id: req.params.id };
    
    // For non-admin users, only show clients they created
    if (req.user.role !== 'admin') {
      clientFilter.createdBy = req.user._id;
    }

    const client = await Client.findOne(clientFilter);

    if (!client) {
      return res.status(404).json({ message: 'Client not found or access denied' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const isActive = req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined;

    // Build filter for projects
    const projectFilter = { client: req.params.id };
    if (status) {
      projectFilter.status = status;
    }
    if (isActive !== undefined) {
      projectFilter.isActive = isActive;
    }

    const projects = await Project.find(projectFilter)
      .populate('client', 'name email')
      .populate('createdBy', 'username email')
      .populate('teamMembers', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Project.countDocuments(projectFilter);

    res.json({
      client: {
        id: client._id,
        name: client.name,
        email: client.email
      },
      projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get client projects error:', error);
    res.status(500).json({ message: 'Server error while fetching client projects' });
  }
});

module.exports = router;
