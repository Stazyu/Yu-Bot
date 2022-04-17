const production = String(process.env.NODE_ENV).includes('production') ? true : false;

export default production;