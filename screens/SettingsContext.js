import React, { createContext, useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


const SettingsContext = createContext();

const SettingsProvider = ({ children }) => {
    const [language, setLanguage] = useState('English');
    const [backgroundColor, setBackgroundColor] = useState('white');
    const [server, setServer] = useState('한국')
  
    useEffect(() => {
      // Load settings from AsyncStorage or set default values
      loadSettings();
    }, []);
  
    useEffect(() => {
      // Save settings to AsyncStorage whenever they change
      saveSettings();
    }, [language, server, backgroundColor]);
  
    const loadSettings = async () => {
      try {
        // Load settings from AsyncStorage and update state
        const storedLanguage = await AsyncStorage.getItem('language');
        const storedServer = await AsyncStorage.getItem('server');
        const storedBackgroundColor = await AsyncStorage.getItem('backgroundColor');
        if (storedLanguage) {
          setLanguage(storedLanguage);
        }
        if (storedServer) {
          setServer(storedServer);
        }
        if (storedBackgroundColor) {
          setBackgroundColor(storedBackgroundColor);
        }
      } catch (error) {
        console.log('Error loading settings:', error);
      }
    };
  
    const saveSettings = async () => {
      try {
        // Save settings to AsyncStorage
        await AsyncStorage.setItem('language', language);
        await AsyncStorage.setItem('server', server);
        await AsyncStorage.setItem('backgroundColor', backgroundColor);
      } catch (error) {
        console.log('Error saving settings:', error);
      }
    };
  
    // Use useMemo to memoize the context values and avoid re-rendering
    const contextValue = useMemo(() => ({
      language,
      backgroundColor,
      server,
      updateLanguage: (newLanguage) => setLanguage(newLanguage),
      updateBackgroundColor: (newColor) => setBackgroundColor(newColor),
      updateServer: (newServer) => setServer(newServer),
    }), [language, backgroundColor, server]);
  
    // Provide the settings state and update functions to the child components
    return (
      <SettingsContext.Provider
        value={contextValue}
      >
        {children}
      </SettingsContext.Provider>
    );
  };

  
export { SettingsContext, SettingsProvider };