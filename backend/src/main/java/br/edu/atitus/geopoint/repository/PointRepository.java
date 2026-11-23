package br.edu.atitus.geopoint.repository;

import br.edu.atitus.geopoint.entity.Point;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class PointRepository {

    private final JdbcTemplate jdbcTemplate;

    public PointRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private static final RowMapper<Point> POINT_MAPPER = (rs, rowNum) -> mapPoint(rs);

    private static Point mapPoint(ResultSet rs) throws SQLException {
        return new Point(
                rs.getObject("id", UUID.class),
                rs.getString("name"),
                rs.getString("description"),
                rs.getBigDecimal("latitude"),
                rs.getBigDecimal("longitude")
        );
    }

    public List<Point> findAll() {
        return jdbcTemplate.query(
                "SELECT id, name, description, latitude, longitude FROM points ORDER BY name, id",
                POINT_MAPPER);
    }

    public Optional<Point> findById(UUID id) {
        List<Point> found = jdbcTemplate.query(
                "SELECT id, name, description, latitude, longitude FROM points WHERE id = ?",
                POINT_MAPPER, id);
        return found.stream().findFirst();
    }

    public boolean existsByNameExceptId(String name, UUID ignoredId) {
        Integer count;
        if (ignoredId == null) {
            count = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM points WHERE LOWER(name) = LOWER(?)",
                    Integer.class, name);
        } else {
            count = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM points WHERE LOWER(name) = LOWER(?) AND id <> ?",
                    Integer.class, name, ignoredId);
        }
        return count != null && count > 0;
    }

    public void insert(Point point) {
        jdbcTemplate.update(
                "INSERT INTO points (id, name, description, latitude, longitude) VALUES (?, ?, ?, ?, ?)",
                point.id(), point.name(), point.description(), point.latitude(), point.longitude());
    }

    public int update(Point point) {
        return jdbcTemplate.update(
                "UPDATE points SET name = ?, description = ?, latitude = ?, longitude = ? WHERE id = ?",
                point.name(), point.description(), point.latitude(), point.longitude(), point.id());
    }

    public int deleteById(UUID id) {
        return jdbcTemplate.update("DELETE FROM points WHERE id = ?", id);
    }
}
