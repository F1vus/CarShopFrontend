const modules = import.meta.glob('./*.{png,jpg,jpeg,svg}', { eager: true });

const logos = Object.values(modules).map(m => (m && m.default) || m);

export default logos;


// function importAll(r) {
//   return r.keys().map(r);
// }
// export default importAll(require.context("./", false, /\.(png|jpe?g|svg)$/));