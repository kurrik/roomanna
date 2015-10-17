require(['jquery', 'seedrandom', 'common-demo'], function ($, seedrandom, Demo) {

  function initClusters(rng, imgData, k) {
    var i,
        clusters = [],
        increment = Math.floor(256 / k),
        numPixels = Math.floor(imgData.length / 4),
        offset;
    for (i = 0; i < k; i++) {
      offset = Math.floor(rng() * numPixels) * 4;
      clusters.push({
        center: [
          imgData[offset],
          imgData[offset + 1],
          imgData[offset + 2]
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

  function updateCenters(rng, clusters) {
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
          Math.floor(rng() * 256),
          Math.floor(rng() * 256),
          Math.floor(rng() * 256)
        ];
        c.valid = false;
      }
      distanceMoved += distance(c.center, newCenter);
      c.center = newCenter;
      c.sum = [ 0, 0, 0 ];
      c.count = 0;
    }
    return distanceMoved;
  }

  function kMeans(rng, imgData, k, thresh, maxiter) {
    var i,
        pt,
        clusters,
        best,
        iterations = 0,
        distanceMoved = Number.MAX_VALUE;
    clusters = initClusters(rng, imgData, k);
    while (distanceMoved > thresh && iterations < maxiter) {
      for (i = 0; i < imgData.length; i += 4) {
        pt = [ imgData[i], imgData[i+1], imgData[i+2] ];
        best = findBestCluster(clusters, pt);
        addToCluster(clusters[best], pt);
      }
      distanceMoved = updateCenters(rng, clusters);
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

  function processImage(img, state) {
    var canvas,
        ctx,
        ctxData,
        imgData,
        clusters,
        rng,
        $img,
        seed = state.seed.toString() || "1",
        k = state.k || 16;

    rng = seedrandom(seed);
    $img = $(img);
    canvas = document.createElement('canvas');
    canvas.width = $img.width() / 4.0;
    canvas.height = $img.height() / 4.0;
    //$(document.body).append(canvas);
    ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctxData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    imgData = ctxData.data;
    clusters = kMeans(rng, imgData, k, 0.1, 5);
    sortClusters(clusters);
    renderClusters(clusters, $(img).closest('p'), $img);
  }

  function renderCluster(cluster, $root, width) {
    var c = cluster.center,
        $div = $('<div class="Cluster"></div>');
    $div.css('background', 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')');
    $div.css('width', width + 'px');
    $root.append($div);
  }

  function renderClusters(clusters, $root, $img) {
    var i,
        validClusters,
        clusterWidth;
    validClusters = $.grep(clusters, function(c) {
      return c.valid && !isNaN(c.center[0] + c.center[1] + c.center[2]);
    });
    clusterWidth = $img.width() / validClusters.length;
    for (i = 0; i < validClusters.length; i++) {
      renderCluster(validClusters[i], $root, clusterWidth);
    }
  }

  function process(demo) {
    $('.analyze').each(function(i, img) {
      if (img.complete) {
        //console.log('loaded', img.src);
        processImage(img, demo.state);
      } else {
        //console.log('adding onload', img.src);
        $(img).load(function() { processImage(this, demo.state); });
      }
    });
  }

  var demo = new Demo(document.body);
  demo.addListener(process);
  demo.setState({
    'seed': 5,
    'k': 16
  });
});
