export default (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    ((callback, element) => setTimeout(callback, 1000 / 60))
).bind(window);
