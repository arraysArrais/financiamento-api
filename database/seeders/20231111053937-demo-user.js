'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('users', [{
      id: 1,
      firstname: 'admin',
      lastname: 'administrator',
      email: 'admin@admin.com',
      password: '$2b$10$MBlVuFBAopWLrrPPw9WikObdlorge0vUjQjJafWEYuhDFLguwhjVm',
      created_at: new Date(),
      updated_at: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
