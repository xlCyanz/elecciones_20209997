import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
// import { formatDate } from "../utils/formatDate"
// import { translate } from "../i18n"

/**
 * This represents an Event of React Native Radio.
 */
export const EventModel = types
  .model("Event")
  .props({
    date: types.string,
    audioName: types.string,
    photo: types.string,
    title: types.string,
    id: types.identifier,
    description: types.string,
  })
  .actions(withSetPropAction)

export interface Event extends Instance<typeof EventModel> { }
export interface EventSnapshotOut extends SnapshotOut<typeof EventModel> { }
export interface EventSnapshotIn extends SnapshotIn<typeof EventModel> { }
