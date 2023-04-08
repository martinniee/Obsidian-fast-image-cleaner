/**
 * get mouse event target
 * @param event 
 */
export const getMouseEventTarget = (event: MouseEvent): HTMLElement => {
    event.preventDefault();
    const target = event.target as HTMLElement;
    return target;
}
