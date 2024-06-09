export default {
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(nanoid)/)', // Pastikan nanoid tidak diabaikan
  ],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1', // Hapus ekstensi .js dari import
  },
};
