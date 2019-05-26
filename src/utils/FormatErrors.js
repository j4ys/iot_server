const FormatErrors = err => {
  console.log(err);
  const errors = err.inner.map(e => {
    return {
      path: e.path,
      message: e.message
    };
  });
  return errors;
};

export default FormatErrors;
