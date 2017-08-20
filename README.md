# Webvideo
Eine kleine Seite, die lokale Videos über ein Webinterface anschauen lässt. Ziemlich nutzlos eigentlich.

Damit alles funktioniert, muss in den "assets" ein Ordner namens "videos" angelegt werden. In diesem dürfen ausschließlich Ordner liegen (für die Staffeln), in welchen wiederum ausschließlich Videos liegen dürfen (für die Episoden).
--------------------------
assets
--css
----...
--js
----...
videos
--Staffel 1 - Der Anfang
----Folge 1 - eins.mp4
----Folge 2 - zwei.mp4
--create_json.jar
index.html
--------------------------
Steht diese Ordnerstruktur, kann die create_json.jar ausgeführt werden, um eine data.js zu erzeugen. In dieser wird die Ordnerstruktur mit allen Daten der Videos abgebildet.
Dann kann die index.html ausgeführt werden.
