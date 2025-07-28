const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  status: {
    type: String,
    enum: ['planning', 'in-progress', 'completed', 'on-hold', 'cancelled'],
    default: 'planning'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  budget: {
    type: Number,
    min: 0
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  deliverables: [{
    name: String,
    description: String,
    completed: {
      type: Boolean,
      default: false
    }
  }],
  teamMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Validate end date is after start date
projectSchema.pre('save', function(next) {
  if (this.startDate && this.endDate && this.endDate < this.startDate) {
    const error = new Error('End date cannot be before start date');
    error.name = 'ValidationError';
    return next(error);
  }
  next();
});

// Index for better query performance
projectSchema.index({ client: 1, status: 1 });
projectSchema.index({ createdBy: 1 });
projectSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Project', projectSchema);
