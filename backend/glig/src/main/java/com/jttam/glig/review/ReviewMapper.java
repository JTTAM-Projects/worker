package com.jttam.glig.review;

import com.jttam.glig.review.dto.ReviewRequest;
import com.jttam.glig.review.dto.ReviewResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ReviewMapper {

    @Mapping(source = "task.id", target = "taskId")
    @Mapping(source = "task.title", target = "taskTitle")
    @Mapping(source = "reviewer.userName", target = "reviewerUsername")
    @Mapping(source = "reviewee.userName", target = "revieweeUsername")
    @Mapping(source = "createdAt", target = "createdAt")
    @Mapping(source = "updatedAt", target = "updatedAt")
    ReviewResponse toReviewResponse(Review review);

    Review toReviewEntity(ReviewRequest reviewRequest);

    void updateReviewFromRequest(ReviewRequest reviewRequest, @MappingTarget Review review);
}
