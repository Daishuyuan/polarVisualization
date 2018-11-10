package com.shou.polar.process;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.shou.polar.pojo.DataProcessor;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.util.ResourceUtils;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Objects;
import java.util.concurrent.Semaphore;
import java.util.regex.Pattern;

import static com.shou.polar.configure.PolarCts.LOCAL_RES_PATH;
import static com.shou.polar.configure.PolarCts.SOURCE_RES_PATH;
import static java.lang.String.valueOf;
import static java.lang.System.out;
import static java.util.Objects.*;

public class LidarDataProcessor extends DataProcessor {
    private static final String joiner = "-";
    private static final String lidarPath = "/data/target/lidar/";
    private static final String OrtecSeededPath = "/lidar/OrtecSeeded/";
    private static final String tempName = "temp.json";
    private static final String windName = "wind.json";
    private static final String naName = "na.json";
    private static final String xaxisName = "xaxis.json";

    @Override
    public void execute() {
        try {
            JsonArray winds = new JsonArray();
            JsonArray nas = new JsonArray();
            JsonArray temps = new JsonArray();
            JsonArray Xdata = new JsonArray();
            Gson gson = new Gson();

            File[] files = ResourceUtils.getFile(SOURCE_RES_PATH + OrtecSeededPath).listFiles();
            assert files != null;
            if (requireNonNull(files).length == 0) {
                out.println("无文件可读");
            } else {
                for (File f : files) {
                    String[] data_rowsplit = FileUtils.readFileToString(f, StandardCharsets.UTF_8).split(valueOf('\n'));
                    JsonArray Xdata1 = new JsonArray();
                    String regex = "\\s+";
                    Pattern p = Pattern.compile(regex);
                    String[] datestr = p.split(data_rowsplit[ 0 ]);

                    String[] filetilte = new String[ 4 ];
                    System.arraycopy(datestr, 1, filetilte, 0, 4);
                    String date = StringUtils.join(filetilte, joiner);
                    Xdata1.add(date);
                    Xdata.add(Xdata1);

                    for (int i = 2; i < data_rowsplit.length; ++i) {
                        String winds1;
                        String nas1;
                        String temps1;
                        String altitude1;
                        JsonArray windCell = new JsonArray();
                        JsonArray naCell = new JsonArray();
                        JsonArray tempCell = new JsonArray();

                        String[] common = p.split(data_rowsplit[ i ]);
                        String flag1 = common[ 6 ];
                        winds1 = common[ 2 ];
                        nas1 = common[ 3 ];
                        temps1 = common[ 1 ];
                        altitude1 = common[ 0 ];

                        if (Integer.parseInt(flag1) != 1) {
                            continue;
                        }

                        windCell.add(date);
                        windCell.add(altitude1);
                        windCell.add(winds1);
                        naCell.add(date);
                        naCell.add(altitude1);
                        naCell.add(nas1);
                        tempCell.add(date);
                        tempCell.add(altitude1);
                        tempCell.add(temps1);

                        winds.add(windCell);
                        nas.add(naCell);
                        temps.add(tempCell);
                    }
                }
                File file = ResourceUtils.getFile(LOCAL_RES_PATH);

                //创建temp.json
                File file1 = new File(file.getAbsolutePath() + lidarPath + tempName);
                if (!tempName.equals(file1.toString())) {
                    boolean newFile = file1.createNewFile();
                }
                FileUtils.writeStringToFile(file1, String.valueOf(gson.toJson(temps)), "UTF-8", false);

                //创建wind.json
                File file2 = new File(file.getAbsolutePath() + lidarPath + windName);
                if (!windName.equals(file2.toString())) {
                    boolean newFile = file2.createNewFile();
                }
                FileUtils.writeStringToFile(file2, String.valueOf(gson.toJson(winds)), "UTF-8", false);

                //创建na.json
                File file3 = new File(file.getAbsolutePath() + lidarPath + naName);
                if (!naName.equals(file3.toString())) {
                    boolean newFile = file3.createNewFile();
                }
                FileUtils.writeStringToFile(file3, String.valueOf(gson.toJson(nas)), "UTF-8", false);

                //创建xaxis.json
                File file4 = new File(file.getAbsolutePath() + lidarPath + xaxisName);
                if (!xaxisName.equals(file4.toString())) {
                    boolean newFile = file4.createNewFile();
                }
                FileUtils.writeStringToFile(file4, String.valueOf(gson.toJson(Xdata)), "UTF-8", false);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
