/**
 * @param {points} [['30.86660','104.390740'], ['30.861961','104.386963']]
 * @returns {point} [latitude, longitude]
 */
export function getPointsCenter(points) {
  var point_num = points.length; //坐标点个数
  var X = 0, Y = 0, Z = 0;
  for (let i = 0; i < points.length; i++) {
    let point = points[i];
    var lat, lng, x, y, z;
    lat = parseFloat(point[0]) * Math.PI / 180;
    lng = parseFloat(point[1]) * Math.PI / 180;
    x = Math.cos(lat) * Math.cos(lng);
    y = Math.cos(lat) * Math.sin(lng);
    z = Math.sin(lat);
    X += x;
    Y += y;
    Z += z;
  }
  X = X / point_num;
  Y = Y / point_num;
  Z = Z / point_num;

  var tmp_lng = Math.atan2(Y, X);
  var tmp_lat = Math.atan2(Z, Math.sqrt(X * X + Y * Y));

  return [tmp_lat * 180 / Math.PI, tmp_lng * 180 / Math.PI];
}

/**
 * @param {point} {latitude, longitude}
 * @param {pointList}
 * @returns boolean
 */
export function isPtInPoly(point, pointList) {
  var iSum = 0
  var iCount = pointList.length

  if (iCount < 3) {
    return false
  }
  //  待判断的点(x, y) 为已知值
  var y = point.latitude
  var x = point.longitude
  for (var i = 0; i < iCount; i++) {
    var y1 = pointList[i].latitude
    var x1 = pointList[i].longitude
    if (i == iCount - 1) {
      var y2 = pointList[0].latitude
      var x2 = pointList[0].longitude
    } else {
      var y2 = pointList[i + 1].latitude
      var x2 = pointList[i + 1].longitude
    }
    // 当前边的 2 个端点分别为 已知值(x1, y1), (x2, y2)
    if (((y >= y1) && (y < y2)) || ((y >= y2) && (y < y1))) {
      //  y 界于 y1 和 y2 之间
      //  假设过待判断点(x, y)的水平直线和当前边的交点为(x_intersect, y_intersect)，有y_intersect = y
      // 则有（2个相似三角形，公用顶角，宽/宽 = 高/高）：|x1 - x2| / |x1 - x_intersect| = |y1 - y2| / |y1 - y|
      if (Math.abs(y1 - y2) > 0) {
        var x_intersect = x1 - ((x1 - x2) * (y1 - y)) / (y1 - y2);
        if (x_intersect < x) {
          iSum += 1
        }
      }
    }
  }
  if (iSum % 2 != 0) {
    return true
  } else {
    return false
  }
}