# Webvideo
Eine kleine Seite, die lokale Videos über ein Webinterface anschauen lässt. Ziemlich nutzlos eigentlich.

Damit alles funktioniert, muss in den "assets" ein Ordner namens "videos" angelegt werden. In diesem dürfen ausschließlich Ordner liegen (für die Staffeln), in welchen wiederum ausschließlich Videos liegen dürfen (für die Episoden).

.-----------------------------. <br>
assets<br>
--css<br>
----...<br>
--js<br>
----...<br>
videos<br>
--Staffel 1 - Der Anfang<br>
----Folge 1 - eins.mp4<br>
----Folge 2 - zwei.mp4<br>
--create_json.jar<br>
index.html<br>
.-----------------------------. 

Steht diese Ordnerstruktur, kann die create_json.jar ausgeführt werden, um eine data.js zu erzeugen. In dieser wird die Ordnerstruktur mit allen Daten der Videos abgebildet.<br>
Dann kann die index.html ausgeführt werden.
