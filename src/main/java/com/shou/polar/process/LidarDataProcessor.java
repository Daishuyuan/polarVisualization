package com.shou.polar.process;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.shou.polar.pojo.DataProcessor;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.jboss.logging.Logger;
import org.springframework.util.ResourceUtils;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

import static com.shou.polar.configure.PolarCts.LOCAL_RES_PATH;
import static com.shou.polar.configure.PolarCts.SOURCE_RES_PATH;
import static java.lang.String.valueOf;

/**
 * 雷达数据三个分量的处理（风、钠离子密度和温度）
 * <notice>该类别仅会以java反射的方式被调用</notice>
 *
 * @author wps 2018/11/10
 * @author dsy 2018/11/11
 */
@SuppressWarnings("unused")
public class LidarDataProcessor extends DataProcessor {
    private static final Logger logger = Logger.getLogger(LidarDataProcessor.class);
    private static final String joiner = "-";
    private static final String lidarPath = "/data/target/lidar/";
    private static final String OrtecSeededPath = "/lidar/OrtecSeeded/";
    private static final String tempName = "temp.json";
    private static final String windName = "wind.json";
    private static final String naName = "na.json";
    private static final String xAxisName = "xAxis.json";

    @Override
    public void execute() {
        Pattern MUTI_BLANKS = Pattern.compile("\\s+");
        JsonArray winds = new JsonArray();
        JsonArray nas = new JsonArray();
        JsonArray temps = new JsonArray();
        JsonArray xData = new JsonArray();
        Gson gson = new Gson();

        try {
            File[] files = ResourceUtils.getFile(SOURCE_RES_PATH + OrtecSeededPath).listFiles();
            if (files != null && files.length != 0) {
                for (File f : files) {
                    String[] data_rowSplit = FileUtils.readFileToString(f, StandardCharsets.UTF_8).split(valueOf('\n'));
                    String[] dateStr = MUTI_BLANKS.split(data_rowSplit[0]);
                    String[] fileCutting = new String[4];
                    System.arraycopy(dateStr, 1, fileCutting, 0, 4);
                    String date = StringUtils.join(fileCutting, joiner);
                    // generate a line of xAxis date data
                    JsonArray xAxisDateData = new JsonArray();
                    xAxisDateData.add(date);
                    xData.add(xAxisDateData);

                    for (int i = 2; i < data_rowSplit.length; ++i) {
                        String[] tokens = MUTI_BLANKS.split(data_rowSplit[i]);
                        String altitudeRow = tokens[0];
                        String tempsRow = tokens[1];
                        String windsRow = tokens[2];
                        String nasRow = tokens[3];
                        String flagRow = tokens[6];
                        if (1 != Integer.parseInt(flagRow)) continue;

                        JsonArray windCell = new JsonArray();
                        JsonArray naCell = new JsonArray();
                        JsonArray tempCell = new JsonArray();

                        // wind processing
                        windCell.add(date);
                        windCell.add(altitudeRow);
                        windCell.add(windsRow);
                        // na processing
                        naCell.add(date);
                        naCell.add(altitudeRow);
                        naCell.add(nasRow);
                        // temperature processing
                        tempCell.add(date);
                        tempCell.add(altitudeRow);
                        tempCell.add(tempsRow);
                        // save winds, nas and temps
                        winds.add(windCell);
                        nas.add(naCell);
                        temps.add(tempCell);
                    }
                }
                File file = ResourceUtils.getFile(LOCAL_RES_PATH);
                Map<String, JsonArray> processorList = new HashMap<>();
                processorList.put(file.getAbsolutePath() + lidarPath + tempName, temps);
                processorList.put(file.getAbsolutePath() + lidarPath + windName, winds);
                processorList.put(file.getAbsolutePath() + lidarPath + naName, nas);
                processorList.put(file.getAbsolutePath() + lidarPath + xAxisName, xData);
                for(Map.Entry<String, JsonArray> process: processorList.entrySet()) {
                    File cacheFile = new File(process.getKey());
                    if (cacheFile.exists() || cacheFile.createNewFile()) {
                        FileUtils.writeStringToFile(
                                cacheFile,
                                String.valueOf(gson.toJson(process.getValue())),
                                StandardCharsets.UTF_8,
                                false
                        );
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
            logger.error(e);
        }
    }
}
