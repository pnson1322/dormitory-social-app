type Listener = () => void;

const listeners = new Set<Listener>();

export function subscribeUserListRefresh(listener: Listener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function emitUserListRefresh() {
  listeners.forEach((listener) => {
    listener();
  });
}
