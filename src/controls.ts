export interface Key {
    value: string,
    isDown: boolean,
    isUp: boolean,
    press: Function,
    release: Function,
    downHandler: Function,
    upHandler: Function,
    unsubscribe: Function
}

interface KBEvent {
    key: string,
    press: Function,
    preventDefault: Function
}

export function keyboard(value:string):Key{
    const key: Key = {
        value: value,
        isDown: false,
        isUp: true,
        press: undefined,
        release: undefined,
        upHandler: undefined,
        downHandler: undefined,
        unsubscribe: undefined
    };
  //The `downHandler`
  key.downHandler = (event: KBEvent) => {
    if (event.key === key.value) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
      event.preventDefault();
    }
  };

  //The `upHandler`
  key.upHandler = (event: KBEvent) => {
    if (event.key === key.value) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
      event.preventDefault();
    }
  };

  //Attach event listeners
  const downListener = key.downHandler.bind(key);
  const upListener = key.upHandler.bind(key);
  
  window.addEventListener(
    "keydown", downListener, false
  );
  window.addEventListener(
    "keyup", upListener, false
  );
  
  // Detach event listeners
  key.unsubscribe = () => {
    window.removeEventListener("keydown", downListener);
    window.removeEventListener("keyup", upListener);
  };
  
  return key;
}