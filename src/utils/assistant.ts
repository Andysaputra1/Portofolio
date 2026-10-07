// Lets any part of the page open the chat widget without sharing React state.
export const OPEN_ASSISTANT_EVENT = "andy:open-assistant";

export function openAssistant() {
  window.dispatchEvent(new Event(OPEN_ASSISTANT_EVENT));
}
