package com.jttam.glig.review;

import com.jttam.glig.review.dto.ReviewRequest;
import com.jttam.glig.review.dto.ReviewResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ReviewMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "task", ignore = true)
    @Mapping(target = "reviewer", ignore = true)
    @Mapping(target = "reviewee", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "rating", source = "rating")
    @Mapping(target = "comment", source = "comment")
    Review toEntity(ReviewRequest request);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "taskId", source = "task.id")
    @Mapping(target = "taskTitle", source = "task.title")
    @Mapping(target = "reviewerUsername", source = "reviewer.userName")
    @Mapping(target = "revieweeUsername", source = "reviewee.userName")
    @Mapping(target = "rating", source = "rating")
    @Mapping(target = "comment", source = "comment")
    @Mapping(target = "createdAt", source = "createdAt")
    @Mapping(target = "updatedAt", source = "updatedAt")
    ReviewResponse toResponse(Review review);
}
