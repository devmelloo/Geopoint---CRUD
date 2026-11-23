package br.edu.atitus.geopoint.service;

import br.edu.atitus.geopoint.dto.PointRequest;
import br.edu.atitus.geopoint.dto.PointResponse;
import br.edu.atitus.geopoint.entity.Point;
import br.edu.atitus.geopoint.exception.DuplicatePointNameException;
import br.edu.atitus.geopoint.exception.PointNotFoundException;
import br.edu.atitus.geopoint.repository.PointRepository;
import java.util.List;
import java.util.UUID;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

@Service
public class PointService {

    private final PointRepository repository;

    public PointService(PointRepository repository) {
        this.repository = repository;
    }

    public List<PointResponse> listAll() {
        return repository.findAll().stream().map(PointResponse::from).toList();
    }

    public PointResponse findById(UUID id) {
        return PointResponse.from(requirePoint(id));
    }

    public PointResponse create(PointRequest request) {
        ensureUniqueName(request.name(), null);
        Point point = toPoint(UUID.randomUUID(), request);
        try {
            repository.insert(point);
        } catch (DuplicateKeyException ex) {
            // Tambem cobre dois cadastros simultaneos com o mesmo nome.
            throw new DuplicatePointNameException(request.name());
        }
        return PointResponse.from(point);
    }

    public PointResponse update(UUID id, PointRequest request) {
        requirePoint(id);
        ensureUniqueName(request.name(), id);
        Point updated = toPoint(id, request);
        try {
            if (repository.update(updated) == 0) {
                throw new PointNotFoundException(id);
            }
        } catch (DuplicateKeyException ex) {
            throw new DuplicatePointNameException(request.name());
        }
        return PointResponse.from(updated);
    }

    public void delete(UUID id) {
        requirePoint(id);
        if (repository.deleteById(id) == 0) {
            throw new PointNotFoundException(id);
        }
    }

    private Point requirePoint(UUID id) {
        return repository.findById(id).orElseThrow(() -> new PointNotFoundException(id));
    }

    private void ensureUniqueName(String name, UUID ignoredId) {
        if (repository.existsByNameExceptId(name, ignoredId)) {
            throw new DuplicatePointNameException(name);
        }
    }

    private static Point toPoint(UUID id, PointRequest request) {
        return new Point(id, request.name(), request.description(),
                request.latitude(), request.longitude());
    }
}
