const AdminService = require('../../services/adminService');
const Admin = require('../../models/admin');
const bcrypt = require('bcrypt');

describe('AdminService', () => {
  describe('authenticate', () => {
    let adminUser;

    beforeEach(async () => {
      // Créer un admin de test
      const hashedPassword = await bcrypt.hash('password123', 10);
      adminUser = await Admin.create({
        email: 'admin@test.com',
        passwordHash: hashedPassword
      });
    });

    it('should authenticate with valid credentials', async () => {
      const result = await AdminService.authenticate('admin@test.com', 'password123');

      expect(result.success).toBe(true);
      expect(result.data.admin.email).toBe('admin@test.com');
      expect(result.data.token).toBeDefined();
      expect(result.data.admin.password).toBeUndefined(); // Password should not be returned
    });

    it('should reject invalid email', async () => {
      const result = await AdminService.authenticate('wrong@test.com', 'password123');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Identifiants invalides');
    });

    it('should reject invalid password', async () => {
      const result = await AdminService.authenticate('admin@test.com', 'wrongpassword');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Identifiants invalides');
    });

    it('should handle missing email', async () => {
      const result = await AdminService.authenticate('', 'password123');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email et mot de passe requis');
    });

    it('should handle missing password', async () => {
      const result = await AdminService.authenticate('admin@test.com', '');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email et mot de passe requis');
    });
  });

  describe('getProfile', () => {
    let adminUser;

    beforeEach(async () => {
      adminUser = await Admin.create({
        email: 'admin@test.com',
        passwordHash: 'hashedpassword'
      });
    });

    it('should return admin profile without password', async () => {
      const result = await AdminService.getProfile(adminUser._id);

      expect(result.success).toBe(true);
      expect(result.data.email).toBe('admin@test.com');
      expect(result.data.password).toBeUndefined();
    });

    it('should handle invalid admin ID', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const result = await AdminService.getProfile(fakeId);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Admin non trouvé');
    });
  });

  describe('updatePassword', () => {
    let adminUser;

    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash('oldpassword', 10);
      adminUser = await Admin.create({
        email: 'admin@test.com',
        passwordHash: hashedPassword
      });
    });

    it('should update password with valid current password', async () => {
      const result = await AdminService.updatePassword(
        adminUser._id,
        'oldpassword',
        'newpassword123'
      );

      expect(result.success).toBe(true);
      expect(result.message).toBe('Mot de passe mis à jour avec succès');

      // Vérifier que le nouveau mot de passe fonctionne
      const authResult = await AdminService.authenticate('admin@test.com', 'newpassword123');
      expect(authResult.success).toBe(true);
    });

    it('should reject invalid current password', async () => {
      const result = await AdminService.updatePassword(
        adminUser._id,
        'wrongpassword',
        'newpassword123'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Mot de passe actuel incorrect');
    });

    it('should handle invalid admin ID', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const result = await AdminService.updatePassword(
        fakeId,
        'oldpassword',
        'newpassword123'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Admin non trouvé');
    });

    it('should handle missing parameters', async () => {
      const result = await AdminService.updatePassword(adminUser._id, '', 'newpassword');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Mot de passe actuel et nouveau mot de passe requis');
    });
  });
});