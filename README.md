# Webvideo
Eine kleine Seite, die lokale Videos über ein Webinterface anschauen lässt. Ziemlich nutzlos eigentlich.

Damit deine Videos gefunden werden, musst du die create_json.jar im Ordner "assets" ausführen und den Ordner auswählen, in dem sich deine Videos befinden.<br>
Das Programm sucht in deinem Ordner zunächst nach Unterordnern und in denen jeweils nach Videos. Dadurch werden Staffeln und Episoden abgebildet.<br>

Hat deine Serie lediglich eine Staffel, musst du diese dennoch in einem Ordner bündeln. Eventuell ändere ich das später...<br>
Bisher werden nicht alle Video- und Audioformate unterstützt, aber herkömmliche mp4-Dateien sollten funktionieren.<br>

Der ausgewählte Ordner sollte im Idealfall folgende Struktur aufweisen:<br>
.-----------------------------. <br>
Staffel 1 - Der Anfang<br>
--Folge 1 - eins.mp4<br>
--Folge 2 - zwei.mp4<br>
.-----------------------------. <br>

Wenn die data.js erzeugt wurde, kann die index.html geöffnet werden.