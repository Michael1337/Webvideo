package videos;

import java.util.ArrayList;

public class Staffel {
    int id;
    String name;
    ArrayList<Episode> episoden;

    public Staffel(int id, String name, ArrayList<Episode> episoden) {
        this.id = id;
        this.name = name;
        this.episoden = episoden;
    }
}
