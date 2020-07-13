import LinkedListNode from './structures/LinkedListNode';
import { timer } from 'rxjs';
import { map, tap } from 'rxjs/operators';

function getLoadingDots() {
  const dots = new LinkedListNode<string>('.');
  dots.next = new LinkedListNode<string>('..');
  dots.next.next = new LinkedListNode<string>('...');
  dots.next.next.next = dots;
  return dots;
}

export function getLoadingDot() {
  let loadingDots = getLoadingDots();
  return timer(0, 500).pipe(
    map(() => {
      return loadingDots;
    }),
    tap(() => (loadingDots = loadingDots.next))
  );
}
