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

        Task activeTask1 = tasks.get("activeTask1");
        Task activeTask2 = tasks.get("activeTask2");
        Task inProgressTask1 = tasks.get("inProgressTask1");
        Task completedTask2 = tasks.get("completedTask2");

        Map<String, Apply> applies = new HashMap<>();

        // PENDING APPLIES
        Apply pending1 = applyRepository.save(new Apply(user2, activeTask1, 45, LocalDateTime.now().plusDays(2),
                "Olen kokenut nurmikonleikkaaja ja hoidan homman nopeasti.", ApplyStatus.PENDING));
        applies.put("pending1", pending1);

        Apply pending2 = applyRepository.save(new Apply(user3, activeTask1, 50, LocalDateTime.now().plusDays(3),
                "Voin leikata nurmikon, kokemusta on.", ApplyStatus.PENDING));
        applies.put("pending2", pending2);

        // ACCEPTED APPLIES
        Apply accepted1 = applyRepository.save(new Apply(user3, activeTask2, 90, LocalDateTime.now().plusDays(1),
                "Voin aloittaa heti.", ApplyStatus.ACCEPTED));
        applies.put("accepted1", accepted1);

        // REJECTED APPLIES
        Apply rejected1 = applyRepository.save(new Apply(user4, activeTask1, 55, LocalDateTime.now().plusDays(2),
                "Hoidan homman.", ApplyStatus.REJECTED));
        applies.put("rejected1", rejected1);

        // CANCELLED APPLIES
        Apply cancelled1 = applyRepository.save(new Apply(user2, inProgressTask1, 90, LocalDateTime.now().plusDays(1),
                "Minulle tuli este.", ApplyStatus.CANCELLED));
        applies.put("cancelled1", cancelled1);

        Apply cancelled2 = applyRepository.save(new Apply(user4, completedTask2, 60, LocalDateTime.now().minusDays(2),
                "En ehdikään.", ApplyStatus.CANCELLED));
        applies.put("cancelled2", cancelled2);

        Apply cancelled3 = applyRepository.save(new Apply(user2, completedTask2, 60, LocalDateTime.now().minusDays(2),
                "En ehdikään.", ApplyStatus.CANCELLED));
        applies.put("cancelled2", cancelled3);

        return applies;
    }

    public void cleanUp() {
        applyRepository.deleteAll();
    }
}
