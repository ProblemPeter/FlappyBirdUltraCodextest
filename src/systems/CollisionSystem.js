export class CollisionSystem {
  static circleRect(circle, rect) {
    const x = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
    const y = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
    const dx = circle.x - x;
    const dy = circle.y - y;
    return dx * dx + dy * dy <= circle.radius ** 2;
  }

  static circles(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dist = Math.hypot(dx, dy);
    return dist < a.radius + b.radius;
  }
}
