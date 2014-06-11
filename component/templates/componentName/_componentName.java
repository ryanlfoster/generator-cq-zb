package apps.lodges.components.modules.<%= componentNameCapitalized %>;

import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;

import com.ngs.cq.components.AbstractComponentModel;
import com.ngs.cq.components.RequestContext;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 
 * @author Yoeman Generator
 * 
 */

public class <%= componentNameCapitalized %> extends AbstractComponentModel {
  
  private static final long serialVersionUID = 1L;

  protected final Logger log = LoggerFactory.getLogger(this.getClass());

  @Override
  protected void prepareModel(final RequestContext ctx, final ValueMap model) {

    try{

      ValueMap pageProperties = ctx.getPageProperties();

      model.put("exampleText", pageProperties.get("exampleText", String.class));

    }catch (Exception e) {
      log.error("Fail loading global footer configuration.", e);
    }
  }

}