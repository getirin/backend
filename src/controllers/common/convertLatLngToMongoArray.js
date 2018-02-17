
module.exports = {
  /**
 * Converts the given lat lng object to a mongo 2d point array.
 * @param lat the latitude for the point
 * @param lng the longtitude for the point.
 * @return {*[]}
 */
  objectToMongo: function({ lat, lng }){
    return [ lng, lat ];
  },
  /**
   * Converts the mongo 2d point array to lat/lng object.
   * @param lng
   * @param lat
   * @return {{lat: *, lng: *}}
   */
  mongoToObject: function([lng, lat]){
    return { lat, lng };
  },
};
