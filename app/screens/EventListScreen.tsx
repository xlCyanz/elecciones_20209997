import React from "react"
import { observer } from "mobx-react-lite"
import { ContentStyle } from "@shopify/flash-list";
import { ActivityIndicator, Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"

import { useStores } from "app/models";
import { Event } from "app/models/Event";
import { EventTabScreenProps } from "app/navigators";
import { Button, Card, EmptyState, ListView, Screen, Text } from "app/components";

import { colors, spacing } from "../theme";

interface EventListScreenProps extends EventTabScreenProps<"EventListScreen"> { }

export const EventListScreen: React.FC<EventListScreenProps> = observer(function EventListScreen({
  navigation
}) {
  const { eventStore } = useStores();

  const [isLoading] = React.useState(false);
  const [refreshing] = React.useState(false);

  return (
    <Screen
      preset="fixed"
      safeAreaEdges={["top"]}
      contentContainerStyle={$screenContentContainer}
    >
      <ListView<Event>
        data={eventStore.EventsForList ?? []}
        contentContainerStyle={$listContentContainer}
        extraData={eventStore.events.length}
        refreshing={refreshing}
        estimatedItemSize={177}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator />
          ) : (
            <EmptyState
              preset="generic"
              style={$emptyState}
              imageStyle={$emptyStateImage}
              heading="No hay eventos agregados"
              button="Intentar cargar los eventos"
              ImageProps={{ resizeMode: "contain" }}
              content="Registra un nuevo evento y los veras aquí."
            />
          )
        }
        ListHeaderComponent={
          <View style={$heading}>
            <Text preset="heading" tx="EventNavigator.eventListScreen.title" />
          </View>
        }
        renderItem={({ item }) => (
          <EventCard
            event={item as never}
            onPress={() => {
              navigation.navigate("EventDetails", { id: item.id })
            }}
          />
        )}
      />
      <Button onPress={() => {
        eventStore.removeAll()
      }}>Borrar datos</Button>
    </Screen>
  )
});

const EventCard = observer(function EpisodeCard({ event, onPress }: { event: Event, onPress: () => void }) {
  return (
    <Card
      style={$item}
      verticalAlignment="force-footer-bottom"
      onPress={onPress}
      HeadingComponent={
        <View style={$metadata}>
          <Text
            style={$metadataText}
            size="xxs"
          >
            {event.date}
          </Text>
        </View>
      }
      content={event.title}
      RightComponent={<Image source={{ uri: 'data:image/jpeg;base64,' + (event.photo ?? "") }} style={$itemThumbnail} />}
    />
  )
})

// #region Styles
const $screenContentContainer: ViewStyle = {
  flex: 1,
}

const $listContentContainer: ContentStyle = {
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.lg + spacing.lg,
  paddingBottom: spacing.lg,
}

const $heading: ViewStyle = {
  marginBottom: spacing.md,
}

const $item: ViewStyle = {
  padding: spacing.md,
  marginTop: spacing.md,
  minHeight: 120,
}

const $itemThumbnail: ImageStyle = {
  width: 70,
  marginTop: spacing.sm,
  height: 70,
  borderRadius: 10,
  alignSelf: "flex-start",
}

const $metadata: TextStyle = {
  color: colors.textDim,
  marginTop: spacing.xs,
  flexDirection: "row",
}

const $metadataText: TextStyle = {
  color: colors.textDim,
  marginEnd: spacing.md,
  marginBottom: spacing.xs,
}

const $emptyState: ViewStyle = {
  marginTop: spacing.xxl,
}

const $emptyStateImage: ImageStyle = {
  transform: [{ scaleX: 1 }],
}