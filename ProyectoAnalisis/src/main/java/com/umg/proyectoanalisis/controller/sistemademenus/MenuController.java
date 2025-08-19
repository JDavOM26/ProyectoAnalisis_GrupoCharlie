package com.umg.proyectoanalisis.controller.sistemademenus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.umg.proyectoanalisis.entity.sistemademenus.Menu;
import com.umg.proyectoanalisis.repository.sistemademenus.MenuRepository;
import com.umg.proyectoanalisis.service.UserRoleOptionsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;


@RestController
@RequestMapping("/api/auth")
public class MenuController {
@Autowired
UserRoleOptionsService userRoleOptionsService;
@Autowired
MenuRepository menuRepository;
    @GetMapping("/menus")
    public List<Menu>  getMenus(){
        return menuRepository.findAll();
    }
    @GetMapping("/opciones")
    public List<Map<String, Object>> getMethodName(@RequestParam String idUsuario) {
        return userRoleOptionsService.obtenerRoleOptions(idUsuario);
    }
    

}
