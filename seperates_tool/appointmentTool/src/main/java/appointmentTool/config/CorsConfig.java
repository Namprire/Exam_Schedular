package appointmentTool.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * Configuration class for CORS (Cross-Origin Resource Sharing) settings.
 * This class defines a bean for creating a CorsFilter to handle CORS configuration.
 */
@Configuration
public class CorsConfig {

    /**
     * Creates and configures a CorsFilter bean for handling CORS settings.
     *
     * @return The CorsFilter bean configured with allowed origins, headers, and methods.
     */
    @Bean
    public CorsFilter corsFilter() {
        // Create a configuration source based on URL patterns
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        // Create a CORS configuration and allow all origins (you might want to restrict this in a production environment)
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOrigin("*");
        config.addAllowedHeader("*");
        config.addAllowedMethod("OPTIONS");
        config.addAllowedMethod("GET");
        config.addAllowedMethod("POST");
        config.addAllowedMethod("PUT");
        config.addAllowedMethod("DELETE");

        // Register the CORS configuration for all URL patterns
        source.registerCorsConfiguration("/**", config);

        // Create and return a CorsFilter with the configured source
        return new CorsFilter(source);
    }
}

