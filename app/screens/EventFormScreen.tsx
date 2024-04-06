import React from "react"
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { observer } from "mobx-react-lite"
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { FormProvider, UseControllerProps, useController, useForm } from "react-hook-form";
import { View, ViewStyle, Button as ButtonRN, ScrollView, Image, ImageStyle } from "react-native"

import { spacing } from "../theme"

import uid from "app/utils/uid";
import { useStores } from "app/models";
import { Event } from "app/models/Event";
import { EventTabScreenProps } from "app/navigators";
import { Button, Screen, Text, TextField, TextFieldProps } from "app/components";
import { formatDateCustom, parseDate } from "app/utils/formatDate";

// Johan Ezequiel Sierra Linares
// 2020-9997

interface EventFormScreenProps extends EventTabScreenProps<"EventFormScreen"> { }

interface IControllerTextInputProps extends TextFieldProps, UseControllerProps<Record<string, string>> {
  name: string;
}

const ControllerTextInput = ({ name, disabled, rules, ...props }: IControllerTextInputProps) => {
  const { field, fieldState } = useController({ name, disabled, rules });

  return (
    <TextField
      {...field}
      {...props}
      keyboardType="default"
      helper={fieldState.error?.message}
      onChangeText={(text) => field.onChange(text)}
      status={fieldState.error ? "error" : undefined}
    />
  )
}

const formatCommon = "MMMM dd, yyyy";

export const EventFormScreen: React.FC<EventFormScreenProps> = observer(function EventFormScreen({ navigation }) {
  const { eventStore } = useStores();

  const methods = useForm<Event>({
    defaultValues: {
      date: formatDateCustom(new Date(), formatCommon)
    }
  });
  const { setValue, resetField } = methods;

  const [photo, setPhoto] = React.useState("");
  const [recording, setRecording] = React.useState<Audio.Recording>();
  const [recordingStatus, setRecordingStatus] = React.useState('idle');
  const [audioPermission, setAudioPermission] = React.useState<boolean>();

  React.useEffect(() => {
    async function getPermission() {
      await Audio.requestPermissionsAsync().then((permission) => {
        console.log('Permission Granted: ' + permission.granted);
        setAudioPermission(permission.granted)
      }).catch(error => {
        console.log(error);
      });
    }

    getPermission();

    return () => {
      if (recording) {
        stopRecording();
      }
    };
  }, []);

  async function startRecording() {
    try {
      // needed for IoS
      if (audioPermission) {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true
        })
      }

      const newRecording = new Audio.Recording();
      console.log('Starting Recording')
      await newRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await newRecording.startAsync();
      setRecording(newRecording);
      setRecordingStatus('recording');

    } catch (error) {
      console.error('Failed to start recording', error);
    }
  }

  async function playRecording(fileName: string) {
    const playbackObject = new Audio.Sound();
    await playbackObject.loadAsync({ uri: FileSystem.documentDirectory + 'recordings/' + `${fileName}` });
    await playbackObject.playAsync();
    console.log(await playbackObject.getStatusAsync())
  }

  async function stopRecording() {
    try {
      if (recordingStatus === 'recording') {
        console.log('Stopping Recording')
        await recording?.stopAndUnloadAsync();
        const recordingUri = recording?.getURI();

        // Create a file name for the recording
        const fileName = `recording-${Date.now()}.caf`;

        // Move the recording to the new directory with the new file name
        await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'recordings/', { intermediates: true });
        await FileSystem.moveAsync({
          from: `${recordingUri}`,
          to: FileSystem.documentDirectory + 'recordings/' + `${fileName}`
        });

        playRecording(fileName);

        // resert our states to record again
        setRecording(undefined);
        setRecordingStatus('stopped');
        resetField("audioName");
        setValue("audioName", `${fileName}`);
      }

    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  }

  return (
    <Screen
      preset="scroll"
      safeAreaEdges={["top"]}
      contentContainerStyle={$screenContentContainer}
    >
      <ScrollView>
        <FormProvider {...methods}>
          <View style={$heading}>
            <Text preset="heading" tx="EventNavigator.eventFormScreen.title" />
          </View>
          <ControllerTextInput
            name="title"
            containerStyle={$viewMargin}
            rules={{ required: "Debes ingresar un titulo" }}
            labelTx="EventNavigator.eventFormScreen.inputs.titleFieldLabel"
            placeholderTx="EventNavigator.eventFormScreen.inputs.titleFieldPlaceholder"
          />
          <ControllerTextInput
            name="description"
            containerStyle={$viewMargin}
            rules={{ required: "Debes ingresar una descripción" }}
            labelTx="EventNavigator.eventFormScreen.inputs.descriptionFieldLabel"
            placeholderTx="EventNavigator.eventFormScreen.inputs.descriptionFieldPlaceholder"
          />
          <View style={$viewMargin}>
            <ControllerTextInput
              readOnly
              name="date"
              labelTx="EventNavigator.eventFormScreen.inputs.dateFieldLabel"
            />
            <ButtonRN title="Seleccionar la fecha del evento" onPress={() => {
              DateTimePickerAndroid.open({
                value: parseDate(methods.getValues("date"), formatCommon),
                onChange: (_, date) => {
                  setValue("date", formatDateCustom(date ?? new Date(), formatCommon))
                }
              })
            }} />
          </View>
          <View style={$viewMargin}>
            <ControllerTextInput
              readOnly
              name="audioName"
              rules={{ required: "Debes grabar un audio" }}
              placeholder="El nombre del audio aparecerá aquí"
              labelTx="EventNavigator.eventFormScreen.inputs.audioFieldLabel"
            />
            <ButtonRN
              title={recording ? 'Parar grabación' : 'Grabar audio'}
              onPress={recording ? stopRecording : startRecording}
            />
          </View>
          <View style={$viewMargin}>
            {photo && (
              <View>
                <Image style={$image} source={{ uri: 'data:image/jpeg;base64,' + (photo ?? "") }} />
                <ButtonRN title="Eliminar imagen" color="red" onPress={() => setPhoto("")} />
              </View>
            )}
            <ButtonRN
              title="Seleccionar foto"
              onPress={async () => {
                try {
                  const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();

                  if (!granted) {
                    alert("Debes tener permiso para seleccionar una imagen");
                    return
                  }

                  const result = await ImagePicker.launchImageLibraryAsync({
                    quality: 0.5,
                    base64: true,
                    allowsMultipleSelection: false,
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  });

                  if (result.assets?.length) {
                    setPhoto(`${result.assets?.[0].base64}`)
                  }
                } catch (error) {
                  console.log("Error al subir la imagen", error)
                }
              }}
            />
          </View>
          <Button
            testID="login-button"
            tx="EventNavigator.eventFormScreen.saveButton"
            style={$viewMargin}
            preset="reversed"
            onPress={methods.handleSubmit((values) => {
              if (!photo) return alert("Debes seleccionar una foto.");
              console.log(values);

              try {
                eventStore.addEvent({ ...values, photo, id: uid(values.title) });
                navigation.navigate("EventListScreen");
              } catch (error) {
                console.error("Error al guardar", error);
              }

              methods.reset();

              // if (!values.title) return alert("Debes ingresar un titulo.");
              // if (!values.audioName) return alert("Debes grabar un audio.");
              // if (!values.date) return alert("Debes seleccionar una fecha.");
              // if (!values.description) return alert("Debes ingresar una descripción.");

              // try {
              //   const events = await AsyncStorage.getItem("events");

              //   if (events) {
              //     await AsyncStorage.setItem("events", JSON.stringify([...JSON.parse(events) ?? [], values]));
              //   } else {
              //     await AsyncStorage.setItem("events", JSON.stringify([values]));
              //   }

              //   helpers.resetForm();
              //   alert("Evento agregado");
              //   router.navigate("/");
              // } catch (error) {
              //   console.error("Almacén local exploto", error);
              // }
            })}
          />
        </FormProvider>
      </ScrollView>
    </Screen>
  )
})

// #region Styles
const $screenContentContainer: ViewStyle = {
  flex: 1,
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.lg + spacing.lg,
  paddingBottom: spacing.lg,
}

const $heading: ViewStyle = {
  marginBottom: spacing.md,
}

const $viewMargin: ViewStyle = {
  marginBottom: spacing.md,
}

const $image: ImageStyle = {
  height: 150,
  width: "100%",
}