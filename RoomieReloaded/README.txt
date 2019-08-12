Um die Konfiguration lokal zu überschreiben bitte wie folgt vorgehen:

1. Eine neue Datei "appsettings.local.json" anlegen
2. Einfügen:
{
  "Zimbra": {
    "Host": "",
    "UserName": "",
    "Password": ""
  },
  "Rooms": [
    {
      "Name": "",
      "Mail": "",
      "NiceName": ""
    }
  ]
}
3. In dieser Datei die Verbindungsdaten für Zimbra und die gewünschten Räume definieren.
4. Die Datei NICHT einchecken respektive aus .gitignore entfernen.