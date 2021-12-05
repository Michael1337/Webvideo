package videos;

import com.google.gson.Gson;

import javax.swing.*;
import java.io.*;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;

public class Videos {
    public Videos() {
    }

    public static void main(String[] args) {
        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (InstantiationException | IllegalAccessException | UnsupportedLookAndFeelException | ClassNotFoundException var21) {
        }

        JFrame parentFrame = new JFrame();
        JFileChooser fileChooser = new JFileChooser();
        fileChooser.setDialogTitle("Wähle den Ordner, in dem Deine Videos liegen.");
        fileChooser.setFileSelectionMode(1);
        fileChooser.setCurrentDirectory(new File("."));
        int userSelection = fileChooser.showOpenDialog(parentFrame);
        File folder = null;
        String path = "";
        if (userSelection == 0) {
            folder = fileChooser.getSelectedFile();
            path = folder.getAbsolutePath();
            path = path.replace("\\", "/");
        } else {
            System.exit(0);
        }

        File[] listOfFolders = folder.listFiles(new FilenameFilter() {
            public boolean accept(File current, String name) {
                return (new File(current, name)).isDirectory();
            }
        });
        int epCounter = 0;
        ArrayList<Staffel> staffeln = new ArrayList();

        for (int i = 0; i < listOfFolders.length; ++i) {
            ArrayList<Episode> episoden = new ArrayList();
            if (listOfFolders[i].isDirectory()) {
                File subfolder = new File(listOfFolders[i].getAbsolutePath());
                File[] listOfSubFiles = subfolder.listFiles(new FilenameFilter() {
                    public boolean accept(File current, String name) {
                        File tempFile = new File(current, name);

                        try {
                            return tempFile.isFile() && Files.probeContentType(tempFile.toPath()).startsWith("video");
                        } catch (NullPointerException | IOException var5) {
                            return false;
                        }
                    }
                });
                Arrays.sort(listOfSubFiles, new Comparator<File>() {
                    private final Comparator<String> NATURAL_SORT = new WindowsExplorerComparator();

                    public int compare(File o1, File o2) {
                        return this.NATURAL_SORT.compare(o1.getName(), o2.getName());
                    }
                });

                for (int j = 0; j < listOfSubFiles.length; ++j) {
                    if (listOfSubFiles[j].isFile()) {
                        String file = listOfSubFiles[j].getName();
                        String name = "";
                        String extension = "";
                        int index = file.lastIndexOf(46);
                        if (index > 0) {
                            name = file.substring(0, index);
                            extension = file.substring(index + 1);
                        }

                        int var10002 = j + 1;
                        ++epCounter;
                        Episode ep = new Episode(var10002, epCounter, name, extension);
                        episoden.add(ep);
                    }
                }

                Staffel staffel = new Staffel(i + 1, subfolder.getName(), episoden);
                staffeln.add(staffel);
            }
        }

        String json = (new Gson()).toJson(staffeln);
        json = "data = '" + json + "';";
        File jsonfile = new File("data.js");

        try {
            Writer writer = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(jsonfile), "UTF8"));
            writer.append("rootPath = '" + path + "';" + "\n\r");
            writer.append(json);
            writer.flush();
            writer.close();
        } catch (IOException var20) {
            var20.printStackTrace();
        }

        System.exit(0);
    }
}
