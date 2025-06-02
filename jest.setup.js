// Mock mongoose module
jest.mock('mongoose', () => {
  const originalModule = jest.requireActual('mongoose');
  
  return {
    __esModule: true,
    ...originalModule,
    // Add mock for mongoose.Types.ObjectId
    Types: {
      ObjectId: jest.fn().mockImplementation(() => ({
        toString: jest.fn().mockReturnValue('mock-id')
      }))
    }
  };
});
