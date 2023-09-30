const ip2Int = (ip) => {
  return ip.split(".").reduce((ipInt, octet) => (ipInt << 8) + +octet, 0) >>> 0;
};

const int2Ip = (ipInt) => {
  return (
    (ipInt >>> 24) +
    "." +
    ((ipInt >>> 16) & 255) +
    "." +
    ((ipInt >>> 8) & 255) +
    "." +
    (ipInt & 255)
  );
};

const findByIntIp = (DB, ipInt) => {
  let start = 0;
  let end = DB.length - 1;
  let mid;

  while (start <= end) {
    mid = Math.floor((start + end) / 2);
    const item = DB[mid].replaceAll('"', "").split(",");

    const [from, to] = [+item[0], +item[1]];

    if (ipInt >= from && ipInt <= to) {
      return {
        ip_range: {
          from: int2Ip(from),
          to: int2Ip(to),
        },
        country: item[3],
        country_code: item[2],
      };
    }

    if (ipInt < from) {
      end = mid - 1;
    } else {
      start = mid + 1;
    }
  }

  return null;
};

module.exports = {
  ip2Int,
  int2Ip,
  findByIntIp,
};
