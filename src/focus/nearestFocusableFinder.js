const Constant = {
  DIRECTION: {
    LEFT: 'left',
    RIGHT: 'right',
    UP: 'up',
    DOWN: 'down'
  },
  DEFAULT: {
    DISTANCE_CALCULATION_STRATEGY: 'default'
  }
}

let instance = null
const getNearestFocusableFinderInstance = function () {
  if (instance === null) {
    instance = createNearestFocusableFinder()
  }
  return instance
}

var strategies = {}

var currentDistanceCalculationStrategy = Constant.DEFAULT.DISTANCE_CALCULATION_STRATEGY

strategies[Constant.DEFAULT.DISTANCE_CALCULATION_STRATEGY] = (function () {
  var OPPOSITE_DIRECTION = {
    left: 'right',
    right: 'left',
    up: 'down',
    down: 'up'
  };

  function getMiddlePointOnTheEdge(position, direction) {
    var point = {
      x: position.left,
      y: position.top
    }

    switch (direction) {
      case Constant.DIRECTION.RIGHT: // when direction is right or left
        point.x += position.width;
      case Constant.DIRECTION.LEFT:
        point.y += position.height / 2;
        break;
      case Constant.DIRECTION.DOWN: // when direction is down or up
        point.y += position.height;
      case Constant.DIRECTION.UP:
        point.x += position.width / 2;
        break;
    }
    return point;
  }

  function isCorrespondingDirection(fromPoint, toPoint, direction) {
    switch (direction) {
      case Constant.DIRECTION.LEFT:
        return fromPoint.x >= toPoint.x;
      case Constant.DIRECTION.RIGHT:
        return fromPoint.x <= toPoint.x;
      case Constant.DIRECTION.UP:
        return fromPoint.y >= toPoint.y;
      case Constant.DIRECTION.DOWN:
        return fromPoint.y <= toPoint.y;
    }

    return false;
  }

  return function (from, to, direction) {
    var fromPoint = getMiddlePointOnTheEdge(from, direction);
    var toPoint = getMiddlePointOnTheEdge(to, OPPOSITE_DIRECTION[direction]);

    if (isCorrespondingDirection(fromPoint, toPoint, direction)) {
      return Math.sqrt(Math.pow(fromPoint.x - toPoint.x, 2) + Math.pow(fromPoint.y - toPoint.y, 2));
    }

    return Infinity;
  };
})()

const createNearestFocusableFinder = () => {
  let focusableElements = {}
  let observer

  let nearestFocusableFinder = {
    getInitial: function (depth, group) {
      let initial
      return initial
    },
    getNearest: function (target, direction) {
      var distance, bestMatch, bestDistance = Infinity
      var targetPosition, neighborPosition
      var targetFocusableData

      targetPosition = getPosition(target);

      Object.keys(focusableElements).forEach(function (name) {
        var focusable = focusableElements[name]
        neighborPosition = getPosition(focusable)
        distance = strategies[currentDistanceCalculationStrategy](targetPosition, neighborPosition, direction)

        if (distance < bestDistance) {
          bestMatch = focusable
          bestDistance = distance
        }
      })
      return bestMatch
    },
    $$put: function (element, name) {
      focusableElements[name] = element
    },
    $$get: function (name) {
      return focusableElements[name]
    },
    $$remove: function (target) {
    }
  }
  return nearestFocusableFinder
}

function getWindow(elem) {
  return (elem != null && elem === elem.window) ? elem : elem.nodeType === 9 && elem.defaultView;
}

const offsetPosition = (elem) => {
  var docElem, win, box = { top: 0, left: 0 }, doc = elem && elem.ownerDocument;
  if (!doc) {
    return;
  }
  docElem = doc.documentElement;
  box = elem.getBoundingClientRect();
  win = getWindow(doc);
  return {
    top: box.top + win.pageYOffset - docElem.clientTop,
    left: box.left + win.pageXOffset - docElem.clientLeft
  }
}

const getPosition = (target) => {
  var focusableDOM = target.focusableDOM//ReactDOM.findDOMNode(target);
  var offset = offsetPosition(focusableDOM);
  return {
    left: offset.left,
    top: offset.top,
    width: focusableDOM.offsetWidth,
    height: focusableDOM.offsetHeight
  };
}

const nearestFocusableFinder = getNearestFocusableFinderInstance()

export default nearestFocusableFinder