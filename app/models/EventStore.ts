import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { Event, EventModel } from "./Event"

export const EventStoreModel = types
  .model("EventStore")
  .props({
    events: types.array(EventModel),
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    get(id: string) {
      return store.events.find((event) => event.id === id)
    },
    addEvent(event: Event) {
      store.events.push(event)
    },
    removeEvent(event: Event) {
      store.events.remove(event)
    },
    removeAll() {
      store.setProp("events", [])
    }
  }))
  .views((store) => ({
    get EventsForList() {
      return store.events;
    },
  }))

export interface EventStore extends Instance<typeof EventStoreModel> { }
export interface EventStoreSnapshot extends SnapshotOut<typeof EventStoreModel> { }
