module.exports = {
  method: 'get',
  unCheckToken: true,
  controller: async () => {
    return {
      status: 'ok',
      now: new Date().toISOString()
    };
  }
};