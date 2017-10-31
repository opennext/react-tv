import nearestFocusableFinder from './nearestFocusableFinder'

const Constant = {
  DIRECTION: {
    LEFT: 'left',
    RIGHT: 'right',
    UP: 'up',
    DOWN: 'down'
  },
  DEFAULT: {
    DEPTH: 0,
    GROUP: 'default',
    KEY_MAP: {
      LEFT: 37,
      RIGHT: 39,
      UP: 38,
      DOWN: 40,
      ENTER: 13
    }//,
    //DISTANCE_CALCULATION_STRATEGY: 'default'
  },
  FOCUS_STATE: {
    BLURRED: 0,
    FOCUSED: 1,
    SELECTED: 2,
    DISABLED: 3
  },
  CLASS_NAMES: [
    'blurred', 'focused', 'selected', 'disabled'
  ]
}

const MOUSE_EVENTS = {
  mouseenter: 'focus',
  mouseleave: 'blur',
  click: 'select'
}


let currentKeyMap = Constant.DEFAULT.KEY_MAP, currentFocusItem

let controllerInstance = null

const getControllerInstance = () => {
  if (controllerInstance === null) {
    controllerInstance = createController()
  }
  return controllerInstance
}

const createController = () => {
  let controller = {
    getCurrentDepth: function () {
      return
    },
    getCurrentFocusItem: function () {
      return
    },
    focus: function (item, originalEvent) {
      focusItem(item, originalEvent)
    },
    blur: function (item, originalEvent) {
      blurItem(item, originalEvent)
    },
    select: function (item, originalEvent) {
    },
    enable: function (item) {
    },
    disable: function (item) {
    }
  }

  document.onkeydown = function (event) {
    var keyCode = event.keyCode || event.which || event.charCode;
    var nextFocusItem;
    switch (keyCode) {
      case currentKeyMap.LEFT:
        nextFocusItem = getNextFocusItem(Constant.DIRECTION.LEFT);
        break;
      case currentKeyMap.RIGHT:
        nextFocusItem = getNextFocusItem(Constant.DIRECTION.RIGHT);
        break;
      case currentKeyMap.UP:
        nextFocusItem = getNextFocusItem(Constant.DIRECTION.UP);
        break;
      case currentKeyMap.DOWN:
        nextFocusItem = getNextFocusItem(Constant.DIRECTION.DOWN);
        break;
      case currentKeyMap.ENTER:
        selectItem(currentFocusItem, event);
        break;
    }

    if (nextFocusItem) {
      blurItem(currentFocusItem, event)
      setCurrentFocusItem(nextFocusItem, event)
    }
  }
  return controller
}

function trigger(item, type) {

}

function blurItem(item, originalEvent) {
  if (item) {
    item.setState({
      focusState: Constant.FOCUS_STATE.BLURRED
    })
    item.props.onBlurred && item.props.onBlurred()
    trigger(item, 'blurred')
  }
}

function focusItem(item, originalEvent) {
  if (item) {
    item.setState({
      focusState: Constant.FOCUS_STATE.FOCUSED
    })
    item.props.onFocused && item.props.onFocused()
    trigger(item, 'focused')
  }
}

function selectItem(item, originalEvent) {
  if (item) {
    item.setState({
      focusState: Constant.FOCUS_STATE.SELECTED
    })
    item.props.onSelected && item.props.onSelected()
    item.setState({
      focusState: Constant.FOCUS_STATE.FOCUSED
    })
  }
}

const getCurrentFocusItem = () => { return currentFocusItem }

const setCurrentFocusItem = (item, event) => {
  focusItem(currentFocusItem = item, event)
}

const getNextFocusItem = (direction) => {
  var nextFocusItemName, nextFocusItem, nextFocusItemData;

  if (currentFocusItem) {
    nextFocusItemName = undefined //TODO Util.getData(currentFocusItem).nextFocus[direction];
    if (nextFocusItemName === undefined) {
      return nearestFocusableFinder.getNearest(currentFocusItem, direction);
    }
  }
}

const controller = getControllerInstance()

export {
  Constant,
  setCurrentFocusItem,
  getCurrentFocusItem,
  getNextFocusItem,
  controller
}