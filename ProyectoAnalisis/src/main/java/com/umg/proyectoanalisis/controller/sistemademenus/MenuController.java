package com.umg.proyectoanalisis.controller.sistemademenus;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.umg.proyectoanalisis.dto.requestdto.postdtos.MenuPostDto;
import com.umg.proyectoanalisis.entity.sistemademenus.Menu;
import com.umg.proyectoanalisis.repository.sistemademenus.MenuRepository;
import com.umg.proyectoanalisis.repository.sistemademenus.ModuloRepository;
import com.umg.proyectoanalisis.service.UserRoleOptionsService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestParam;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/auth")
public class MenuController {
    @Autowired
    UserRoleOptionsService userRoleOptionsService;
    @Autowired
    MenuRepository menuRepository;
    @Autowired
    ModuloRepository moduloRepository;

    @GetMapping("/menus")
    public ResponseEntity<List<Menu>> obtenerMenus() {
        try {
            List<Menu> menus = menuRepository.findAll();
            if (menus.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(menus, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/crear-menu")
    public ResponseEntity<Menu> crearMenu(@Valid @RequestBody MenuPostDto menuDto) {
        try {
            Menu menu = new Menu();
            menu.setNombre(menuDto.getNombre());
            menu.setOrdenMenu(menuDto.getOrdenMenu());
            menu.setIdModulo(menuDto.getIdModulo());
            menu.setFechaCreacion(LocalDateTime.now());
            menu.setUsuarioCreacion(menuDto.getIdUsuario());
            Menu menuGuardado = menuRepository.save(menu);
            return new ResponseEntity<>(menuGuardado, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/actualizar-menu/{idMenu}")
    public ResponseEntity<Menu> actualizarMenu(@PathVariable Integer idMenu, @Valid @RequestBody MenuPostDto menuDto) {
        try {
            Menu menuExistente = menuRepository.findById(idMenu)
                    .orElseThrow(() -> new RuntimeException("Menú no encontrado con id"));
            
          
                    
            menuExistente.setNombre(menuDto.getNombre());
            menuExistente.setOrdenMenu(menuDto.getOrdenMenu());
            menuExistente.setIdModulo(menuDto.getIdModulo());
            menuExistente.setFechaModificacion(LocalDateTime.now());
            menuExistente.setUsuarioModificacion(menuDto.getIdUsuario());
             Menu menuGuardado = menuRepository.save(menuExistente);
            return new ResponseEntity<>(menuGuardado, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/borrar-menu")
    public ResponseEntity<String> borrarMenu(@RequestParam Integer idMenu) {
        try {
            if (!menuRepository.existsById(idMenu)) {
                return new ResponseEntity<>("Menú no encontrado con id: " + idMenu, HttpStatus.NOT_FOUND);
            }
            menuRepository.deleteById(idMenu);
            return new ResponseEntity<>("Menú eliminado exitosamente", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al eliminar el menú", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/opciones")
    public ResponseEntity<List<Map<String, Object>>> obtenerOpciones(@RequestParam String idUsuario) {
        try {
            List<Map<String, Object>> opciones = userRoleOptionsService.obtenerRoleOptions(idUsuario);
            if (opciones.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(opciones, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Faltan Imprimir y Exportar

}
