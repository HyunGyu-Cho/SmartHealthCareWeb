package com.example.smart_healthcare.loader;

import com.example.smart_healthcare.entity.FoodNutrition;
import com.example.smart_healthcare.repository.FoodNutritionRepository;
import com.opencsv.CSVReader;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Component
public class FoodNutritionLoader implements CommandLineRunner {
    private final FoodNutritionRepository repo;
    private static final Logger logger = LoggerFactory.getLogger(FoodNutritionLoader.class);

    public FoodNutritionLoader(FoodNutritionRepository repo) {
        this.repo = repo;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        logger.info("식품 영양 정보 데이터 로딩을 시작합니다.");
        ClassPathResource resource = new ClassPathResource("data/food_nutrition.csv");
        
        // 1. DB에서 모든 식품명을 한 번에 읽어와 Set에 저장
        Set<String> existingNames = repo.findAll()
            .stream()
            .map(FoodNutrition::getFoodName)
            .collect(java.util.stream.Collectors.toSet());
        
        try (
            InputStreamReader isr = new InputStreamReader(resource.getInputStream(), "CP949");
            CSVReader reader = new CSVReader(isr)
        ) {
            String[] header = reader.readNext();
            if (header == null) {
                logger.error("CSV 파일이 비어있습니다.");
                return;
            }

            Map<String, Integer> idx = new HashMap<>();
            for (int i = 0; i < header.length; i++) {
                idx.put(header[i], i);
            }

            if (!idx.containsKey("식품명")) {
                logger.error("CSV에 '식품명' 컬럼이 없습니다!");
                return;
            }

            String[] line;
            int totalCount = 0;

            while ((line = reader.readNext()) != null) {
                try {
                    FoodNutrition fn = new FoodNutrition();
                    fn.setFoodName(line[idx.get("식품명")]);

                    Map<String, Float> nutrients = new HashMap<>();
                    for (String col : header) {
                        if (col.equals("식품명") || col.equals("영양성분함량기준량")) continue;
                        Integer i = idx.get(col);
                        if (i != null && i < line.length) {
                            try {
                                String value = line[i].replace(",", "").trim();
                                if (!value.isEmpty()) {
                                    nutrients.put(col, Float.parseFloat(value));
                                }
                            } catch (NumberFormatException e) {
                                logger.warn("숫자 변환 실패: {} - {}", col, line[i]);
                                nutrients.put(col, 0f);
                            }
                        }
                    }
                    fn.setNutrients(nutrients);

                    // 개선: 메모리에서 중복 체크
                    if (!existingNames.contains(fn.getFoodName())) {
                        repo.save(fn);
                        existingNames.add(fn.getFoodName());
                        totalCount++;
                        if (totalCount % 100 == 0) {
                            logger.info("{}개 데이터 처리 완료", totalCount);
                        }
                    } else {
                        logger.info("중복된 식품명: {} - 저장하지 않음", fn.getFoodName());
                    }
                } catch (Exception e) {
                    logger.error("데이터 처리 중 오류 발생: {}", e.getMessage());
                }
            }

            logger.info("식품 영양 정보 데이터 로딩이 완료되었습니다. 총 {}개의 데이터가 처리되었습니다.", totalCount);
        } catch (Exception e) {
            logger.error("데이터 로딩 중 오류 발생: {}", e.getMessage());
            throw e;
        }
    }
} 