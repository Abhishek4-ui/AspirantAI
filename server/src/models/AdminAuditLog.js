const mongoose = require('mongoose');

const adminAuditLogSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  adminEmail: { type: String, required: true },
  action: { type: String, required: true }, // e.g. 'APPROVE_QUESTION', 'UPDATE_EXAM', 'CREATE_VACANCY', 'BAN_USER'
  targetEntity: { 
    type: String, 
    enum: ['Question', 'Exam', 'Vacancy', 'Internship', 'Job', 'User', 'System', 'CommunityPost'],
    required: true 
  },
  targetId: { type: String, default: '' },
  details: { type: mongoose.Schema.Types.Mixed, default: {} },
  ipAddress: { type: String, default: '' }
}, {
  timestamps: true
});

module.exports = mongoose.model('AdminAuditLog', adminAuditLogSchema);
