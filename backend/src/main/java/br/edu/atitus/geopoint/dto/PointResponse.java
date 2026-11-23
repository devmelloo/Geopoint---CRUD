package br.edu.atitus.geopoint.dto;

import br.edu.atitus.geopoint.entity.Point;
import java.math.BigDecimal;
import java.util.UUID;

public record PointResponse(
        UUID id,
        String name,
        String description,
        BigDecimal latitude,
        BigDecimal longitude
) {
    public static PointResponse from(Point point) {
        return new PointResponse(point.id(), point.name(), point.description(),
                point.latitude(), point.longitude());
    }
}
