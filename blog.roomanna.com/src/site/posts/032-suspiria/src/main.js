/*
   var img = new Image();
img.src = 'https://mdn.mozillademos.org/files/5397/rhino.jpg';
img.onload = function() {
  draw(this);
};

function draw(img) {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  img.style.display = 'none';
  var imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
  var data = imageData.data;
    
  var invert = function() {
    for (var i = 0; i < data.length; i += 4) {
      data[i]     = 255 - data[i];     // red
      data[i + 1] = 255 - data[i + 1]; // green
      data[i + 2] = 255 - data[i + 2]; // blue
    }
    ctx.putImageData(imageData, 0, 0);
  };

  var grayscale = function() {
    for (var i = 0; i < data.length; i += 4) {
      var avg = (data[i] + data[i +1] + data[i +2]) / 3;
      data[i]     = avg; // red
      data[i + 1] = avg; // green
      data[i + 2] = avg; // blue
    }
    ctx.putImageData(imageData, 0, 0);
  };

  var invertbtn = document.getElementById('invertbtn');
  invertbtn.addEventListener('click', invert);
  var grayscalebtn = document.getElementById('grayscalebtn');
  grayscalebtn.addEventListener('click', grayscale);
}
 */
require(['jquery'], function ($) {

  function initClusters(imgData, k) {
    var i,
        clusters = [],
        increment = Math.floor(256 / k),
        numPixels = Math.floor(imgData.length / 4),
        offset;
    for (i = 0; i < k; i++) {
      offset = Math.floor(Math.random() * numPixels) * 4;
      clusters.push({
        center: [
          imgData[offset],
          imgData[offset + 1],
          imgData[offset + 2]
          //Math.floor(Math.random() * 256),
          //Math.floor(Math.random() * 256),
          //Math.floor(Math.random() * 256)
          // increment * i,
          // increment * i,
          // increment * i
        ],
        sum: [ 0, 0, 0 ],
        count: 0,
        valid: false
      });
    }
    return clusters;
  }

  function distance(a, b) {
    var dx = a[0] - b[0],
        dy = a[1] - b[1],
        dz = a[2] - b[2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  function findBestCluster(clusters, pt) {
    var i,
        dist,
        bestCluster = 0,
        bestDist = Number.MAX_VALUE;
    for (i = 0; i < clusters.length; i++) {
      dist = distance(clusters[i].center, pt);
      if (dist < bestDist) {
        bestDist = dist;
        bestCluster = i;
      }
    }
    return bestCluster;
  }

  function addToCluster(cluster, pt) {
    cluster.sum[0] += pt[0];
    cluster.sum[1] += pt[1];
    cluster.sum[2] += pt[2];
    cluster.count++;
  }

  function updateCenters(clusters) {
    var i,
        c,
        distanceMoved = 0,
        newCenter;
    for (i = 0; i < clusters.length; i++) {
      c = clusters[i];
      if (c.count > 0) {
        newCenter = [
          Math.round(c.sum[0] / c.count),
          Math.round(c.sum[1] / c.count),
          Math.round(c.sum[2] / c.count)
        ];
        c.valid = true;
      } else {
        newCenter = [
          Math.floor(Math.random() * 256),
          Math.floor(Math.random() * 256),
          Math.floor(Math.random() * 256)
        ]
        c.valid = false;
      }
      distanceMoved += distance(c.center, newCenter);
      c.center = newCenter;
      c.sum = [ 0, 0, 0 ];
      c.count = 0;
    }
    return distanceMoved;
  }

  function kMeans(imgData, k, thresh, maxiter) {
    var i,
        pt,
        clusters,
        best,
        iterations = 0,
        distanceMoved = Number.MAX_VALUE;
    clusters = initClusters(imgData, k);
    while (distanceMoved > thresh && iterations < maxiter) {
      for (i = 0; i < imgData.length; i += 4) {
        pt = [ imgData[i], imgData[i+1], imgData[i+2] ];
        best = findBestCluster(clusters, pt);
        addToCluster(clusters[best], pt);
      }
      distanceMoved = updateCenters(clusters);
      iterations++;
    }
    return clusters;
  }

  function sortClusters(clusters) {
    function appx(v, thresh) { return Math.round(thresh * v); }

    clusters.sort(function(a, b) {
      var A = getHSL(a.center[0], a.center[1], a.center[2]),
          B = getHSL(b.center[0], b.center[1], b.center[2]);

      if (Math.abs(A[2] - B[2]) > 0.5) {
        return A[2] - B[2]; // Lightness
      }
      if (Math.abs(A[1] - B[1]) > 0.5) {
        return A[1] - B[1]; // Saturation
      }
      if (Math.abs(A[0] - B[0]) > 30 ) {
        return A[0] - B[0]; // Hue
      }
      return A[0] - B[0]; // Hue
    });
  }

  function getHSL(r, g, b) {
    var R = r / 255,
        G = g / 255,
        B = b / 255,
        min = Math.min(R, G, B),
        max = Math.max(R, G, B),
        delta = max - min,
        H,
        S,
        L;

    if (delta === 0) {
      H = 0;
    } else if (max === R) {
      H = 60 * (((G - B) / delta) % 6);
    } else if (max === G) {
      H = 60 * (((B - R) / delta) + 2);
    } else {
      H = 60 * (((R - G) / delta) + 4);
    }
    if (H < 0) { H += 360; }

    L = (max + min) / 2;

    if (delta === 0) {
      S = 0;
    } else {
      S = delta / (1 - Math.abs(2 * L - 1));
    }

    return [ H, S, L ];
  }

  function analyze(img, k) {
    var canvas,
        ctx,
        ctxData,
        imgData,
        clusters;

    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    ctxData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    imgData = ctxData.data;
    clusters = kMeans(imgData, 16, 0.1, 10);
    sortClusters(clusters);
    renderClusters(clusters, $(img).closest('p'));
  }

  function renderCluster(cluster, $root) {
    var c = cluster.center,
        $div = $('<div class="Cluster"></div>');
    if (cluster.valid && !isNaN(c[0] + c[1] + c[2])) {
      $div.css('background', 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')');
      $root.append($div);
    }
  }

  function renderClusters(clusters, $root) {
    var i;
    for (i = 0; i < clusters.length; i++) {
      renderCluster(clusters[i], $root);
    }
  }

  $('.analyze').each(function(i, img) {
    if (img.complete) {
      //console.log('loaded', img.src);
      analyze(img);
    } else {
      //console.log('adding onload', img.src);
      $(img).load(function() { analyze(this); });
    }
  });
});
