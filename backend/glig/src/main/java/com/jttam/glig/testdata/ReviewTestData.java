package com.jttam.glig.testdata;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.jttam.glig.domain.application.Application;
import com.jttam.glig.domain.task.Task;
import com.jttam.glig.domain.user.User;
import com.jttam.glig.review.Review;
import com.jttam.glig.review.ReviewRepository;

/**
 * Test data component for creating sample Review entities.
 * Provides review data for integration tests and development database seeding.
 */
@Component
public class ReviewTestData {

    private final ReviewRepository reviewRepository;

    public ReviewTestData(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    /**
     * Creates sample review test data for completed tasks.
     * Creates 15+ reviews with proper completed tasks and accepted applications.
     * Ensures both tasker and employer reviews are represented.
     * 
     * @param users        Map of test users
     * @param tasks        Map of test tasks
     * @param applications Map of test applications
     * @return Map of created Review entities
     */
    public Map<String, Review> createTestReviews(Map<String, User> users, Map<String, Task> tasks,
            Map<String, Application> applications) {
        reviewRepository.deleteAll();

        Map<String, Review> reviews = new HashMap<>();

        // Get users
        User user1 = users.get("user1");
        User user2 = users.get("user2");
        User user3 = users.get("user3");
        User user4 = users.get("user4");
        User auth0User = users.get("auth0");

        // Get tasks owned by different users - need enough for 18 unique review
        // scenarios
        java.util.List<Task> user1Tasks = tasks.values().stream()
                .filter(t -> t.getUser().getUserName().equals("User1"))
                .limit(10)
                .collect(java.util.stream.Collectors.toList());

        java.util.List<Task> user2Tasks = tasks.values().stream()
                .filter(t -> t.getUser().getUserName().equals("User2"))
                .limit(10)
                .collect(java.util.stream.Collectors.toList());

        java.util.List<Task> user3Tasks = tasks.values().stream()
                .filter(t -> t.getUser().getUserName().equals("User3"))
                .limit(10)
                .collect(java.util.stream.Collectors.toList());

        java.util.List<Task> user4Tasks = tasks.values().stream()
                .filter(t -> t.getUser().getUserName().equals("User4"))
                .limit(10)
                .collect(java.util.stream.Collectors.toList());

        java.util.List<Task> auth0Tasks = tasks.values().stream()
                .filter(t -> t.getUser().getUserName().equals("auth0|68d505ed399d6048c5f38275"))
                .limit(10)
                .collect(java.util.stream.Collectors.toList());

        if (user1Tasks.size() >= 7 && user2Tasks.size() >= 8 && user3Tasks.size() >= 8 && user4Tasks.size() >= 3) {
            // User1 TASKER PROFILE (11 reviews - more than 10 to test scrolling): User1
            // worked as tasker
            // Tasks owned by user2/3/4, they review user1's tasker performance
            Review r1 = new Review(user2Tasks.get(0), user2, user1, 5,
                    "Excellent work! Very professional and efficient. Would hire again.");
            Review r2 = new Review(user2Tasks.get(1), user2, user1, 3,
                    "Decent work but could have been more thorough. Average experience.");
            Review r3 = new Review(user2Tasks.get(2), user2, user1, 3,
                    "Acceptable work. Met basic requirements but nothing exceptional.");
            Review r4 = new Review(user2Tasks.get(6), user2, user1, 5,
                    "Amazing attention to detail! Exceeded all expectations.");
            Review r5 = new Review(user2Tasks.get(7), user2, user1, 4,
                    "Good service, would hire again for future projects.");
            Review r6 = new Review(user3Tasks.get(0), user3, user1, 4,
                    "Good job overall. Completed on time and met expectations.");
            Review r7 = new Review(user3Tasks.get(1), user3, user1, 5,
                    "Superb craftsmanship! Every detail was perfect.");
            Review r8 = new Review(user3Tasks.get(5), user3, user1, 4,
                    "Professional and courteous. Highly skilled at their work.");
            Review r9 = new Review(user3Tasks.get(6), user3, user1, 5,
                    "Best tasker I've worked with! Will definitely hire again.");
            Review r10 = new Review(user4Tasks.get(0), user4, user1, 5,
                    "Outstanding service! Went above and beyond. Highly recommended!");
            Review r11 = new Review(user4Tasks.get(1), user4, user1, 4,
                    "Reliable and competent. Would use services again.");

            // User1 EMPLOYER PROFILE (5 reviews): user1 owned tasks, taskers rate user1 as
            // employer
            // Tasks owned by user1, taskers (user2/3/4) review user1's employer quality
            Review r12 = new Review(user1Tasks.get(0), user2, user1, 5,
                    "Great employer! Clear instructions and prompt payment.");
            Review r13 = new Review(user1Tasks.get(1), user2, user1, 3,
                    "Communication could be better, but payment was on time.");
            Review r14 = new Review(user1Tasks.get(5), user2, user1, 4, "Fair employer with reasonable expectations.");
            Review r15 = new Review(user1Tasks.get(2), user3, user1, 4,
                    "Pleasant to work with. Good communication throughout the project.");
            Review r16 = new Review(user1Tasks.get(3), user4, user1, 5,
                    "Perfect client! Respectful and fair. Highly recommend.");

            // User2 TASKER PROFILE (4 reviews): user2 worked as tasker, employers rate
            // user2
            // Tasks owned by user1/3, they review user2's tasker performance
            Review r17 = new Review(user1Tasks.get(4), user1, user2, 5,
                    "Fantastic work ethic! Delivered high quality results.");
            Review r18 = new Review(user3Tasks.get(2), user3, user2, 3,
                    "Adequate performance. Some minor issues but overall okay.");
            Review r19 = new Review(user3Tasks.get(3), user3, user2, 4, "Very reliable and punctual. Would recommend.");
            Review r20 = new Review(user3Tasks.get(4), user3, user2, 5,
                    "Exceptional service! Professional and friendly.");

            // User2 EMPLOYER PROFILE (3 reviews): user2 owned tasks, taskers rate user2 as
            // employer
            // Tasks owned by user2, taskers (user3/4) review user2's employer quality
            Review r21 = new Review(user2Tasks.get(3), user3, user2, 4,
                    "Good employer. Fair pricing and reasonable expectations.");
            Review r22 = new Review(user2Tasks.get(4), user4, user2, 5,
                    "Excellent communication! Very satisfied with the collaboration.");
            Review r23 = new Review(user2Tasks.get(5), user3, user2, 5, "One of the best employers to work with!");

            // User3 TASKER PROFILE (2 reviews): user3 worked as tasker, employers rate
            // user3
            // Tasks owned by user1/4, they review user3's tasker performance
            Review r24 = new Review(user1Tasks.get(6), user1, user3, 4,
                    "Solid performance. Met all requirements efficiently.");
            Review r25 = new Review(user4Tasks.get(2), user4, user3, 5,
                    "Great job! Would definitely work together again.");

            // Auth0 User TASKER PROFILE (8 reviews): auth0 user worked as tasker
            // Tasks owned by user1/2/3/4, they review auth0 user's tasker performance
            Review r26 = new Review(user1Tasks.get(7), user1, auth0User, 5, "Erinomainen työ! Suosittelen lämpimästi.");
            Review r27 = new Review(user1Tasks.get(8), user1, auth0User, 4, "Hyvä työnjälki, ammattimainen suoritus.");
            Review r28 = new Review(user2Tasks.get(8), user2, auth0User, 5,
                    "Todella taitava tekijä! Paras kenen kanssa olen työskennellyt.");
            Review r29 = new Review(user2Tasks.get(9), user2, auth0User, 3, "Ok suoritus, mutta voisi olla tarkempi.");
            Review r30 = new Review(user3Tasks.get(7), user3, auth0User, 4, "Luotettava ja nopea. Kiitos!");
            Review r31 = new Review(user3Tasks.get(8), user3, auth0User, 5,
                    "Ylitti odotukset! Ehdottomasti uudestaan yhteistyöhön.");
            Review r32 = new Review(user4Tasks.get(3), user4, auth0User, 5, "Huippulaatua! Erittäin tyytyväinen.");
            Review r33 = new Review(user4Tasks.get(4), user4, auth0User, 4,
                    "Ammattitaitoinen ja ystävällinen palvelu.");

            // Auth0 User EMPLOYER PROFILE (6 reviews): auth0 user owned tasks, taskers rate
            // auth0 as employer
            // Only add if auth0 has tasks
            Review r34 = null;
            Review r35 = null;
            Review r36 = null;
            Review r37 = null;
            Review r38 = null;
            Review r39 = null;

            if (auth0Tasks.size() >= 6) {
                r34 = new Review(auth0Tasks.get(0), user1, auth0User, 5,
                        "Erinomainen työnantaja! Selkeät ohjeet ja nopea maksu.");
                r35 = new Review(auth0Tasks.get(1), user1, auth0User, 4, "Mukava asiakas, suosittelen.");
                r36 = new Review(auth0Tasks.get(2), user2, auth0User, 5, "Paras työnantaja! Ammattimaisesti hoidettu.");
                r37 = new Review(auth0Tasks.get(3), user2, auth0User, 3, "Viestintä voisi olla parempaa.");
                r38 = new Review(auth0Tasks.get(4), user3, auth0User, 4, "Hyvä työantaja, reilut pelisäännöt.");
                r39 = new Review(auth0Tasks.get(5), user4, auth0User, 5, "Täydellistä yhteistyötä! Kiitos paljon.");
            }

            reviews.put("r1", reviewRepository.save(r1));
            reviews.put("r2", reviewRepository.save(r2));
            reviews.put("r3", reviewRepository.save(r3));
            reviews.put("r4", reviewRepository.save(r4));
            reviews.put("r5", reviewRepository.save(r5));
            reviews.put("r6", reviewRepository.save(r6));
            reviews.put("r7", reviewRepository.save(r7));
            reviews.put("r8", reviewRepository.save(r8));
            reviews.put("r9", reviewRepository.save(r9));
            reviews.put("r10", reviewRepository.save(r10));
            reviews.put("r11", reviewRepository.save(r11));
            reviews.put("r12", reviewRepository.save(r12));
            reviews.put("r13", reviewRepository.save(r13));
            reviews.put("r14", reviewRepository.save(r14));
            reviews.put("r15", reviewRepository.save(r15));
            reviews.put("r16", reviewRepository.save(r16));
            reviews.put("r17", reviewRepository.save(r17));
            reviews.put("r18", reviewRepository.save(r18));
            reviews.put("r19", reviewRepository.save(r19));
            reviews.put("r20", reviewRepository.save(r20));
            reviews.put("r21", reviewRepository.save(r21));
            reviews.put("r22", reviewRepository.save(r22));
            reviews.put("r23", reviewRepository.save(r23));
            reviews.put("r24", reviewRepository.save(r24));
            reviews.put("r25", reviewRepository.save(r25));
            reviews.put("r26", reviewRepository.save(r26));
            reviews.put("r27", reviewRepository.save(r27));
            reviews.put("r28", reviewRepository.save(r28));
            reviews.put("r29", reviewRepository.save(r29));
            reviews.put("r30", reviewRepository.save(r30));
            reviews.put("r31", reviewRepository.save(r31));
            reviews.put("r32", reviewRepository.save(r32));
            reviews.put("r33", reviewRepository.save(r33));

            if (r34 != null) {
                reviews.put("r34", reviewRepository.save(r34));
                reviews.put("r35", reviewRepository.save(r35));
                reviews.put("r36", reviewRepository.save(r36));
                reviews.put("r37", reviewRepository.save(r37));
                reviews.put("r38", reviewRepository.save(r38));
                reviews.put("r39", reviewRepository.save(r39));
            }
        }

        return reviews;
    }

    /**
     * Removes all review test data from the database.
     * Should be called before creating new test data or during test cleanup.
     */
    public void cleanUp() {
        reviewRepository.deleteAll();
    }
}
