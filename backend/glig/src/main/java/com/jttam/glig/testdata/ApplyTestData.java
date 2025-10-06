package com.jttam.glig.testdata;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.jttam.glig.domain.apply.Apply;
import com.jttam.glig.domain.apply.ApplyRepository;
import com.jttam.glig.domain.apply.ApplyStatus;
import com.jttam.glig.domain.task.Task;
import com.jttam.glig.domain.user.User;

@Component
public class ApplyTestData {

        private final ApplyRepository applyRepository;

        public ApplyTestData(ApplyRepository applyRepository) {
                this.applyRepository = applyRepository;
        }

        public Map<String, Apply> createTestApplies(Map<String, User> users, Map<String, Task> tasks) {
                applyRepository.deleteAll();

                User user2 = users.get("user2");
                User user3 = users.get("user3");
                User user4 = users.get("user4");
                User auth0 = users.get("auth0");

                Task activeTask1 = tasks.get("activeTask1");
                Task activeTask2 = tasks.get("activeTask2");
                Task activeTask3 = tasks.get("activeTask3");
                Task activeTask4 = tasks.get("activeTask4");
                Task activeTask5 = tasks.get("activeTask5");
                Task activeTask6 = tasks.get("activeTask6");
                Task activeTask7 = tasks.get("activeTask7");
                Task activeTask8 = tasks.get("activeTask8");
                Task cancelledTask1 = tasks.get("cancelledTask1");
                Task cancelledTask2 = tasks.get("cancelledTask2");
                Task inProgressTask1 = tasks.get("inProgressTask1");
                Task inProgressTask2 = tasks.get("inProgressTask2");
                Task completedTask1 = tasks.get("completedTask1");
                Task completedTask2 = tasks.get("completedTask2");
                Task expiredTask1 = tasks.get("expiredTask1");
                Task expiredTask2 = tasks.get("expiredTask2");

                Map<String, Apply> applies = new HashMap<>();

                // PENDING APPLIES
                Apply pending1 = applyRepository.save(new Apply(user2, activeTask1, 45, LocalDateTime.now().plusDays(2),
                                "Olen kokenut nurmikonleikkaaja ja hoidan homman nopeasti.", ApplyStatus.PENDING));
                applies.put("pending1", pending1);

                Apply pending2 = applyRepository.save(new Apply(user3, activeTask1, 50, LocalDateTime.now().plusDays(3),
                                "Voin leikata nurmikon, kokemusta on.", ApplyStatus.PENDING));
                applies.put("pending2", pending2);

                // ACCEPTED APPLIES
                Apply accepted1 = applyRepository
                                .save(new Apply(user3, activeTask2, 90, LocalDateTime.now().plusDays(1),
                                                "Voin aloittaa heti.", ApplyStatus.ACCEPTED));
                applies.put("accepted1", accepted1);

                // REJECTED APPLIES
                Apply rejected1 = applyRepository
                                .save(new Apply(user4, activeTask1, 55, LocalDateTime.now().plusDays(2),
                                                "Hoidan homman.", ApplyStatus.REJECTED));
                applies.put("rejected1", rejected1);

                // CANCELLED APPLIES
                Apply cancelled1 = applyRepository
                                .save(new Apply(user2, inProgressTask1, 90, LocalDateTime.now().plusDays(1),
                                                "Minulle tuli este.", ApplyStatus.CANCELLED));
                applies.put("cancelled1", cancelled1);

                Apply cancelled2 = applyRepository
                                .save(new Apply(user4, completedTask2, 60, LocalDateTime.now().minusDays(2),
                                                "En ehdikään.", ApplyStatus.CANCELLED));
                applies.put("cancelled2", cancelled2);

                Apply cancelled3 = applyRepository
                                .save(new Apply(user2, completedTask2, 60, LocalDateTime.now().minusDays(2),
                                                "En ehdikään.", ApplyStatus.CANCELLED));
                applies.put("cancelled2", cancelled3);

                // auth0 test -user applies
                Apply testApply1 = applyRepository.save(new Apply(auth0, activeTask1, 50, LocalDateTime.now(),
                                "Test user apply 1", ApplyStatus.PENDING));
                applies.put("testApply1", testApply1);

                Apply testApply2 = applyRepository.save(new Apply(auth0, activeTask2, 60, LocalDateTime.now(),
                                "Test user apply 2", ApplyStatus.ACCEPTED));
                applies.put("testApply2", testApply2);

                Apply testApply3 = applyRepository.save(new Apply(auth0, activeTask3, 30, LocalDateTime.now(),
                                "Test user apply 3", ApplyStatus.REJECTED));
                applies.put("testApply3", testApply3);

                Apply testApply4 = applyRepository.save(new Apply(auth0, activeTask4, 45, LocalDateTime.now(),
                                "Test user apply 4", ApplyStatus.CANCELLED));
                applies.put("testApply4", testApply4);

                Apply testApply5 = applyRepository.save(new Apply(auth0, activeTask5, 25, LocalDateTime.now(),
                                "Test user apply 5", ApplyStatus.PENDING));
                applies.put("testApply5", testApply5);

                Apply testApply6 = applyRepository.save(new Apply(auth0, activeTask6, 35, LocalDateTime.now(),
                                "Test user apply 6", ApplyStatus.ACCEPTED));
                applies.put("testApply6", testApply6);

                Apply testApply7 = applyRepository.save(new Apply(auth0, activeTask7, 50, LocalDateTime.now(),
                                "Test user apply 7", ApplyStatus.REJECTED));
                applies.put("testApply7", testApply7);

                Apply testApply8 = applyRepository.save(new Apply(auth0, activeTask8, 15, LocalDateTime.now(),
                                "Test user apply 8", ApplyStatus.CANCELLED));
                applies.put("testApply8", testApply8);

                Apply testApply9 = applyRepository.save(new Apply(auth0, cancelledTask1, 20, LocalDateTime.now(),
                                "Test user apply 9", ApplyStatus.PENDING));
                applies.put("testApply9", testApply9);

                Apply testApply10 = applyRepository.save(new Apply(auth0, cancelledTask2, 150, LocalDateTime.now(),
                                "Test user apply 10", ApplyStatus.ACCEPTED));
                applies.put("testApply10", testApply10);

                Apply testApply11 = applyRepository.save(new Apply(auth0, inProgressTask1, 100, LocalDateTime.now(),
                                "Test user apply 11", ApplyStatus.REJECTED));
                applies.put("testApply11", testApply11);

                Apply testApply12 = applyRepository.save(new Apply(auth0, inProgressTask2, 120, LocalDateTime.now(),
                                "Test user apply 12", ApplyStatus.CANCELLED));
                applies.put("testApply12", testApply12);

                Apply testApply13 = applyRepository.save(new Apply(auth0, completedTask1, 80, LocalDateTime.now(),
                                "Test user apply 13", ApplyStatus.PENDING));
                applies.put("testApply13", testApply13);

                Apply testApply14 = applyRepository.save(new Apply(auth0, completedTask2, 40, LocalDateTime.now(),
                                "Test user apply 14", ApplyStatus.ACCEPTED));
                applies.put("testApply14", testApply14);

                Apply testApply15 = applyRepository.save(new Apply(auth0, expiredTask1, 15, LocalDateTime.now(),
                                "Test user apply 15", ApplyStatus.REJECTED));
                applies.put("testApply15", testApply15);

                Apply testApply16 = applyRepository.save(new Apply(auth0, expiredTask2, 30, LocalDateTime.now(),
                                "Test user apply 16", ApplyStatus.CANCELLED));
                applies.put("testApply16", testApply16);

                return applies;
        }

        public void cleanUp() {
                applyRepository.deleteAll();
        }
}
