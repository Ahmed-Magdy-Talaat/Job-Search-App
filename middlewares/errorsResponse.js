import express from "express";
export const handleErrResponse = async (err, req, res, next) => {
  res.status(500).json({
    errMsg: err.message,
    errLocation: err.stack,
  });
};
