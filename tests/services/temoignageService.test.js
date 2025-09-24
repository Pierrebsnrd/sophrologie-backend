const TemoignageService = require('../../services/temoignageService');
const Temoignage = require('../../models/temoignage');

describe('TemoignageService', () => {
  describe('getAll', () => {
    beforeEach(async () => {
      // Créer des témoignages de test
      await Temoignage.create([
        { name: 'Jean', message: 'Excellent service!', status: 'validated' },
        { name: 'Marie', message: 'Très satisfaite', status: 'pending' },
        { name: 'Pierre', message: 'Parfait', status: 'rejected' }
      ]);
    });

    it('should return all testimonials with pagination', async () => {
      const result = await TemoignageService.getAll(1, 10);

      expect(result.success).toBe(true);
      expect(result.data.temoignages).toHaveLength(3);
      expect(result.data.pagination.currentPage).toBe(1);
      expect(result.data.pagination.total).toBe(3);
    });

    it('should handle pagination correctly', async () => {
      const result = await TemoignageService.getAll(1, 2);

      expect(result.success).toBe(true);
      expect(result.data.temoignages).toHaveLength(2);
      expect(result.data.pagination.totalPages).toBe(2);
    });
  });

  describe('getValidated', () => {
    beforeEach(async () => {
      await Temoignage.create([
        { name: 'Jean', message: 'Excellent service!', status: 'validated' },
        { name: 'Marie', message: 'Très satisfaite', status: 'pending' },
        { name: 'Pierre', message: 'Parfait', status: 'validated' }
      ]);
    });

    it('should return only validated testimonials', async () => {
      const result = await TemoignageService.getValidated(1, 10);

      expect(result.success).toBe(true);
      expect(result.data.temoignages).toHaveLength(2);
      result.data.temoignages.forEach(temoignage => {
        expect(temoignage.status).toBe('validated');
      });
    });
  });

  describe('create', () => {
    it('should create a new testimonial with pending status', async () => {
      const testimonialData = {
        name: 'Nouveau Client',
        message: 'Message de test pour un nouveau témoignage'
      };

      const result = await TemoignageService.create(testimonialData);

      expect(result.success).toBe(true);
      expect(result.data.name).toBe(testimonialData.name);
      expect(result.data.message).toBe(testimonialData.message);
      expect(result.data.status).toBe('pending');
    });

    it('should handle missing required fields', async () => {
      const testimonialData = {
        name: 'Test'
        // message manquant
      };

      const result = await TemoignageService.create(testimonialData);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('updateStatus', () => {
    let testimonialId;

    beforeEach(async () => {
      const testimonial = await Temoignage.create({
        name: 'Test User',
        message: 'Test message',
        status: 'pending'
      });
      testimonialId = testimonial._id;
    });

    it('should update testimonial status to validated', async () => {
      const result = await TemoignageService.updateStatus(testimonialId, 'validated');

      expect(result.success).toBe(true);
      expect(result.data.status).toBe('validated');
    });

    it('should update testimonial status to rejected', async () => {
      const result = await TemoignageService.updateStatus(testimonialId, 'rejected');

      expect(result.success).toBe(true);
      expect(result.data.status).toBe('rejected');
    });

    it('should handle invalid testimonial ID', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const result = await TemoignageService.updateStatus(fakeId, 'validated');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Témoignage non trouvé');
    });
  });

  describe('delete', () => {
    let testimonialId;

    beforeEach(async () => {
      const testimonial = await Temoignage.create({
        name: 'Test User',
        message: 'Test message',
        status: 'pending'
      });
      testimonialId = testimonial._id;
    });

    it('should delete testimonial successfully', async () => {
      const result = await TemoignageService.delete(testimonialId);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Témoignage supprimé');

      // Vérifier que le témoignage n'existe plus
      const deletedTestimonial = await Temoignage.findById(testimonialId);
      expect(deletedTestimonial).toBeNull();
    });

    it('should handle invalid testimonial ID', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const result = await TemoignageService.delete(fakeId);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Témoignage non trouvé');
    });
  });
});